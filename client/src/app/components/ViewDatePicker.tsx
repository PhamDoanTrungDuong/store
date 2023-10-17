import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { DemoContainer } from '@mui/x-date-pickers';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import agent from "../api/agent";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { currencyFormat } from "../utilities/util";
import { useAppSelector } from "../store/configureStore";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			// text: "Chart.js Bar Chart",
		},
	},
};

const labels = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const ViewDatePicker: React.FC = () => {
	const [value, setValue] = useState<any>(dayjs());
	const [month, setMonth] = useState<any>();
	const [yearValue, setYearValue] = useState<any>(dayjs());
	const [salePerDay, setSalePerDay] = useState<any>();
	const { allTotal } = useAppSelector((state) => state.order);

	const data = {
		labels,
		datasets: [
			{
				label: `Total Money Per Month - ${yearValue.$y}`,
				data: labels.map(
					(_, idx) =>
						month && (month.find((_: any, id: any) => idx === id)) / 100
				),
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};
	useEffect(() => {
		if(value){
			const data = {d: value.$D!, m: value.$M + 1, y: value.$y}
			agent.Admin.statisticCurrentDay(data).then((res) => {
				setSalePerDay(res)
			})
		}
		if(yearValue){
			const data = {d: yearValue.$D!, m: yearValue.$M + 1, y: yearValue.$y}
			agent.Admin.statisticPerYear(data).then((res) => {
				// console.log(res)
				setMonth(res);
			});
		}
	}, [value, yearValue]);
	return (
		<>
			<div className="flex justify-between items-center">
				<div className="rounded-div2">
					<h2 className="p-2 font-medium text-lg">Revenue Per Day</h2>
					<div className="w-[100%] mt-4 flex justify-center items-center">
						{/* <p className="font-medium mr-2">Date:</p> */}
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<Stack spacing={3}>
								<DatePicker
									openTo="day"
									views={["year", "month", "day"]}
									label="Year, month and date"
									value={value}
									onChange={(newValue: any) => {
										setValue(newValue);
									}}
									renderInput={(params: any) => (
										<TextField {...params} helperText={null} />
									)}
								/>
							</Stack>
						</LocalizationProvider>
						<div className="text-white mx-3 p-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-400">
								<p>
									{currencyFormat(salePerDay)}
								</p>
						</div>
					</div>
				</div>
				{/* <div className="rounded-div2">
					<h2 className="p-2 font-medium text-lg">Revenue Date To Date</h2>
					<div className="w-[100%] mt-4 flex justify-center items-center">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DemoContainer components={['DateRangePicker']}>
								<DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} />
							</DemoContainer>
						</LocalizationProvider>
						<div className="text-white mx-3 p-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-400">
								<p>
									{currencyFormat(salePerDay)}
								</p>
						</div>
					</div>
				</div> */}
			</div>
			<div className="rounded-div2 mt-5">
				<h3 className="text-lg font-medium p-2">Total Revenue Per Month</h3>
				<div className="flex justify-end items-center w-full gap-6">
					<div className="text-white mx-3 p-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-400 font-bold text-xl">
						<p>{currencyFormat(allTotal)}</p>
					</div>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Stack spacing={3}>
							<DatePicker
								views={['year']}
								label="Year"
								value={yearValue}
								onChange={(newValue: any) => {
									setYearValue(newValue);
								}}
								renderInput={(params2: any) => (
									<TextField {...params2} helperText={null} />
								)}
							/>
						</Stack>
					</LocalizationProvider>
				</div>
				<Bar options={options} data={data} />
			</div>
		</>
	);
};

export default ViewDatePicker;
