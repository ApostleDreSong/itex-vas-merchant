import React, { useState, useEffect, useCallback } from 'react';
import NumberFormat from 'react-number-format';
import OperantTable from '../table/OperantTable';
import TableElementSymbol from '../TableElementSymbol';
import axios from 'axios';
import styles from './dashboardTopCountriesTable.module.scss';

function DashboardTopCountriesTable() {
	const [pageNumber, setPageNumber] = useState<number>(1);
	const [rowsPerPage, setRowsPerPage] = useState<string | number | undefined>(
		5
	);
	const [totalRows, setTotalRows] = useState<number>(0);
	const [rows, setRows] = useState<any[]>([]);

	const changePage = (value: number) => {
		setPageNumber(value);
	};
	const limit = (value: number) => {
		setRowsPerPage(value);
	};

	const [apiRes, setApiRes] = useState<any>();

	useEffect(() => {
		axios
			.get<any[]>(
				`/mockfolder/dashboardTopCountriesTableData.json`
				// {
				// 	headers: {
				// 		Authorization: `Bearer ${access_token}`,
				// 	},
				// }
			)
			.then((res: any) => {
				setApiRes(res.data);
			})
			.catch((err) => console.log(err));
	}, []);

	interface Column {
		id: 'country' | 'top_up_amount' | 'total_count';

		label: any;
		minWidth?: number;
		align?: 'right' | 'left' | 'center';
	}

	const columns: Column[] = [
		{
			id: 'country',
			label: <TableElementSymbol title='COUNTRY' />,
			align: 'left',
			minWidth: 100,
		},
		{
			id: 'top_up_amount',
			label: <TableElementSymbol title='TOP UP AMOUNT' />,
			align: 'left',
			minWidth: 100,
		},
		{
			id: 'total_count',
			label: <TableElementSymbol title='TOTAL COUNT' />,
			align: 'left',
			minWidth: 100,
		},
	];

	const LoanRowTab = useCallback(
		(
			id: number | string,
			country: string | number,
			top_up_amount: string | number,
			total_count: number | string
		) => ({
			country: country,
			top_up_amount: (
				<NumberFormat
					value={Number(top_up_amount)}
					displayType={'text'}
					thousandSeparator={true}
					prefix={'₦'}
				/>
			),
			total_count: (
				<NumberFormat
					value={Number(total_count)}
					displayType={'text'}
					thousandSeparator={true}
				/>
			),
		}),
		[]
	);

	useEffect(() => {
		const newRowOptions: any[] = [];
		apiRes &&
			apiRes?.length !== 0 &&
			apiRes?.map((each: any) =>
				newRowOptions.push(
					LoanRowTab(
						each.id,
						each.country,
						each.top_up_amount,
						each.total_count
					)
				)
			);
		setRows(newRowOptions);
	}, [apiRes, LoanRowTab]);

	return (
		<>
			<h1 className={styles.wrapperh1}>Top Countries</h1>

			<OperantTable
				columns={columns}
				rows={rows}
				totalRows={totalRows}
				changePage={changePage}
				limit={limit}
			/>
		</>
	);
}

export default DashboardTopCountriesTable;