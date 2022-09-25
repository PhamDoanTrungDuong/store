import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

	const data = {
		labels,
		datasets: [
			{
				label: "Total Money Per Month",
				data: labels.map(
					(_, idx) =>
						month && (month.find((_: any, id: any) => idx === id)) / 100
				),
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};
	useEffect(() => {
		// if(value){
		// 	const data = {d: value.$D!, m: value.$M + 1, y: value.$y}
		// 	agent.Admin.statisticCurrentDay(data).then((res) => {
		// 		console.log(res)
		// 	})
		// }
		agent.Admin.statisticMonth().then((res) => {
			setMonth(res);
		});
	}, [value]);
	return (
		<>
			<div className="flex justify-end items-center">
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Stack spacing={3}>
						<DatePicker
							openTo="year"
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
			</div>
			<Bar options={options} data={data} />
		</>
	);
};

export default ViewDatePicker;
