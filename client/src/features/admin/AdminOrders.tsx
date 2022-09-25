import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import agent from "../../app/api/agent";
// import Loading from "../../app/layout/Loading";
import { currencyFormat } from "../../app/utilities/util";
import OrderDetailed from "../orders/OrderDetailed";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TbGift, TbHome2 } from "react-icons/tb";
import { AiOutlineHome } from "react-icons/ai";
import { RiTruckLine } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineCardGiftcard } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { fetchOrdersAsync, setOrdLoad } from "./adminSlice";
import OrderSearch from "../../app/components/OrderSearch";
import { Link } from "react-router-dom";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import moment from "moment";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const AdminOrders: React.FC = () => {
	const { orders, loadOrder } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();
	// const [loading, setLoading] = useState(true);
	const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);
	const [selectedDeli, setSelectedDeli] = useState<number>(0);
	const { register, handleSubmit } = useForm();
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	useEffect(() => {
		!loadOrder ? dispatch(fetchOrdersAsync()) : dispatch(fetchOrdersAsync());
	}, [dispatch, loadOrder]);

	if (selectedOrderNumber > 0)
		return (
			<OrderDetailed
				order={orders?.find((o) => o.id === selectedOrderNumber)!}
				setSelectedOrder={setSelectedOrderNumber}
			/>
		);

	const onSubmit = (data: any) => {
		data = { id: selectedDeli, ...data };
		agent.Orders.statusDelivery(data).then(() => {
			dispatch(setOrdLoad());
			setSelectedDeli(0);
			handleClose();
		});
	};

	return (
		<div className="mt-5 p-5">
			<div className="flex items-center ml-2 mb-5">
				<Link to="/">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineHome size={20} />
						Home
					</h1>
				</Link>
				<div className="mx-2">
					<IoIosArrowForward size={15} />
				</div>
				<Link to="/">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<MdOutlineCardGiftcard size={20} />
						Orders
					</h1>
				</Link>
			</div>
			<div className="flex gap-2 justify-between items-center mb-5">
				<div></div>
				<div className="basis-3/4 w-[40%]">
					<OrderSearch />
				</div>
				<div></div>
			</div>
			<div>
				<Box
					sx={{
						borderBottom: 1,
						borderColor: "divider",
					}}>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="basic tabs example">
						<Tab label="Pending Orders" {...a11yProps(0)} />
						<Tab label="Confirmed" {...a11yProps(1)} />
						<Tab label="Delivered" {...a11yProps(2)} />
						<Tab label="Refunded" {...a11yProps(3)} />
					</Tabs>
				</Box>
				<div className="h-[500px] overflow-y-scroll">
					<Box sx={{ width: "100%" }}>
						<TabPanel value={value} index={0}>
							<TableContainer component={Paper}>
								<Table
									sx={{ minWidth: 650 }}
									aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>
												Order
												number
											</TableCell>
											<TableCell>
												Fullname
											</TableCell>
											{/* <TableCell>City</TableCell>
								<TableCell>Address</TableCell> */}
											<TableCell align="center">
												Total
											</TableCell>
											<TableCell align="center">
												Order
												Date
											</TableCell>
											<TableCell align="center">
												Order
												Status
											</TableCell>
											<TableCell align="center">
												Delivery
												Status
											</TableCell>
											<TableCell align="center"></TableCell>
											<TableCell align="center"></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{orders
											?.filter(
												(
													item
												) =>
													item.deliveryStatus ===
														"PendingConfirm" &&
													item.isRefund ===
														false
											)
											?.map(
												(
													order
												) => (
													<TableRow
														key={
															order.id
														}
														sx={{
															"&:last-child td, &:last-child th":
																{
																	border: 0,
																},
														}}>
														<TableCell
															sx={{
																pl: 6,
															}}
															component="th"
															scope="row">
															#{" "}
															{
																order.id
															}
														</TableCell>
														<TableCell>
															<span className="font-bold text-lg capitalize">
																{
																	order
																		.shippingAddress
																		.fullName
																}
															</span>
														</TableCell>
														{/* <TableCell>
										{
											order
												.shippingAddress
												.city
										}
									</TableCell>
									<TableCell>
										{
											order
												.shippingAddress
												.address1
										}
									</TableCell> */}
														<TableCell align="center">
															{currencyFormat(
																order.total
															)}
														</TableCell>
														<TableCell align="center">
															{moment(
																order.orderDate
															).format(
																"MMM Do YY, h:mm a"
															)}
														</TableCell>
														<TableCell align="center">
															{
																order.orderStatus
															}
														</TableCell>
														<TableCell align="center">
															{order.deliveryStatus ===
															"PendingConfirm" ? (
																<div className="flex justify-center items-center">
																	<TbGift
																		size={
																			25
																		}
																		className="mr-3 text-indigo-600"
																	/>{" "}
																	Pending
																	Confirm
																</div>
															) : order.deliveryStatus ===
															  "OnTheWay" ? (
																<div className="flex justify-center items-center">
																	<RiTruckLine
																		size={
																			25
																		}
																		className="mr-3 fill-red-600"
																	/>{" "}
																	On
																	The
																	Way
																</div>
															) : order.deliveryStatus ===
															  "ProductDelivered" ? (
																<div className="flex justify-center items-center">
																	<TbHome2
																		size={
																			25
																		}
																		className="mr-3 text-green-600"
																	/>{" "}
																	Delivered
																</div>
															) : (
																"Order Placed"
															)}
														</TableCell>
														<TableCell align="center">
															<button
																className="bg-yellow-400 border border-yellow-400 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-yellow-400 duration-200 mr-3"
																onClick={() => {
																	handleOpen();
																	setSelectedDeli(
																		order.id
																	);
																}}>
																Delivery
															</button>
															<button
																className="c-btn"
																onClick={() =>
																	setSelectedOrderNumber(
																		order.id
																	)
																}>
																View
															</button>
														</TableCell>
													</TableRow>
												)
											)}
									</TableBody>
								</Table>
							</TableContainer>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<TableContainer component={Paper}>
								<Table
									sx={{ minWidth: 650 }}
									aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>
												Order
												number
											</TableCell>
											<TableCell>
												Fullname
											</TableCell>
											{/* <TableCell>City</TableCell>
								<TableCell>Address</TableCell> */}
											<TableCell align="center">
												Total
											</TableCell>
											<TableCell align="center">
												Order
												Date
											</TableCell>
											<TableCell align="center">
												Order
												Status
											</TableCell>
											<TableCell align="center">
												Delivery
												Status
											</TableCell>
											<TableCell align="center"></TableCell>
											<TableCell align="center"></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{orders
											?.filter(
												(
													item
												) =>
													item.deliveryStatus ===
														"OnTheWay" &&
													item.isRefund ===
														false
											)
											?.map(
												(
													order
												) => (
													<TableRow
														key={
															order.id
														}
														sx={{
															"&:last-child td, &:last-child th":
																{
																	border: 0,
																},
														}}>
														<TableCell
															sx={{
																pl: 6,
															}}
															component="th"
															scope="row">
															#{" "}
															{
																order.id
															}
														</TableCell>
														<TableCell>
															<span className="font-bold text-lg capitalize">
																{
																	order
																		.shippingAddress
																		.fullName
																}
															</span>
														</TableCell>
														{/* <TableCell>
										{
											order
												.shippingAddress
												.city
										}
									</TableCell>
									<TableCell>
										{
											order
												.shippingAddress
												.address1
										}
									</TableCell> */}
														<TableCell align="center">
															{currencyFormat(
																order.total
															)}
														</TableCell>
														<TableCell align="center">
															{moment(
																order.orderDate
															).format(
																"MMM Do YY, h:mm a"
															)}
														</TableCell>
														<TableCell align="center">
															{
																order.orderStatus
															}
														</TableCell>
														<TableCell align="center">
															{order.deliveryStatus ===
															"PendingConfirm" ? (
																<div className="flex justify-center items-center">
																	<TbGift
																		size={
																			25
																		}
																		className="mr-3 text-indigo-600"
																	/>{" "}
																	Pending
																	Confirm
																</div>
															) : order.deliveryStatus ===
															  "OnTheWay" ? (
																<div className="flex justify-center items-center">
																	<RiTruckLine
																		size={
																			25
																		}
																		className="mr-3 fill-red-600"
																	/>{" "}
																	On
																	The
																	Way
																</div>
															) : order.deliveryStatus ===
															  "ProductDelivered" ? (
																<div className="flex justify-center items-center">
																	<TbHome2
																		size={
																			25
																		}
																		className="mr-3 text-green-600"
																	/>{" "}
																	Delivered
																</div>
															) : (
																"Order Placed"
															)}
														</TableCell>
														<TableCell align="center">
															{/* <button
																className="bg-yellow-400 border border-yellow-400 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-yellow-400 duration-200 mr-3"
																onClick={() => {
																	handleOpen();
																	setSelectedDeli(
																		order.id
																	);
																}}>
																Delivery
															</button> */}
															<button
																className="c-btn"
																onClick={() =>
																	setSelectedOrderNumber(
																		order.id
																	)
																}>
																View
															</button>
														</TableCell>
													</TableRow>
												)
											)}
									</TableBody>
								</Table>
							</TableContainer>
						</TabPanel>
						<TabPanel value={value} index={2}>
							<TableContainer component={Paper}>
								<Table
									sx={{ minWidth: 650 }}
									aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>
												Order
												number
											</TableCell>
											<TableCell>
												Fullname
											</TableCell>
											{/* <TableCell>City</TableCell>
								<TableCell>Address</TableCell> */}
											<TableCell align="center">
												Total
											</TableCell>
											<TableCell align="center">
												Order
												Date
											</TableCell>
											<TableCell align="center">
												Order
												Status
											</TableCell>
											<TableCell align="center">
												Delivery
												Status
											</TableCell>
											<TableCell align="center"></TableCell>
											<TableCell align="center"></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{orders
											?.filter(
												(
													item
												) =>
													item.deliveryStatus ===
														"ProductDelivered" &&
													item.isRefund ===
														false
											)
											?.map(
												(
													order
												) => (
													<TableRow
														key={
															order.id
														}
														sx={{
															"&:last-child td, &:last-child th":
																{
																	border: 0,
																},
														}}>
														<TableCell
															sx={{
																pl: 6,
															}}
															component="th"
															scope="row">
															#{" "}
															{
																order.id
															}
														</TableCell>
														<TableCell>
															<span className="font-bold text-lg capitalize">
																{
																	order
																		.shippingAddress
																		.fullName
																}
															</span>
														</TableCell>
														{/* <TableCell>
										{
											order
												.shippingAddress
												.city
										}
									</TableCell>
									<TableCell>
										{
											order
												.shippingAddress
												.address1
										}
									</TableCell> */}
														<TableCell align="center">
															{currencyFormat(
																order.total
															)}
														</TableCell>
														<TableCell align="center">
															{moment(
																order.orderDate
															).format(
																"MMM Do YY, h:mm a"
															)}
														</TableCell>
														<TableCell align="center">
															{
																order.orderStatus
															}
														</TableCell>
														<TableCell align="center">
															{order.deliveryStatus ===
															"PendingConfirm" ? (
																<div className="flex justify-center items-center">
																	<TbGift
																		size={
																			25
																		}
																		className="mr-3 text-indigo-600"
																	/>{" "}
																	Pending
																	Confirm
																</div>
															) : order.deliveryStatus ===
															  "OnTheWay" ? (
																<div className="flex justify-center items-center">
																	<RiTruckLine
																		size={
																			25
																		}
																		className="mr-3 fill-red-600"
																	/>{" "}
																	On
																	The
																	Way
																</div>
															) : order.deliveryStatus ===
															  "ProductDelivered" ? (
																<div className="flex justify-center items-center">
																	<TbHome2
																		size={
																			25
																		}
																		className="mr-3 text-green-600"
																	/>{" "}
																	Delivered
																</div>
															) : (
																"Order Placed"
															)}
														</TableCell>
														<TableCell align="center">
															{/* <button
																className="bg-yellow-400 border border-yellow-400 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-yellow-400 duration-200 mr-3"
																onClick={() => {
																	handleOpen();
																	setSelectedDeli(
																		order.id
																	);
																}}>
																Delivery
															</button> */}
															<button
																className="c-btn"
																onClick={() =>
																	setSelectedOrderNumber(
																		order.id
																	)
																}>
																View
															</button>
														</TableCell>
													</TableRow>
												)
											)}
									</TableBody>
								</Table>
							</TableContainer>
						</TabPanel>
						<TabPanel value={value} index={3}>
							<table className="table-auto w-full text-xs sm:text-sm md:text-base">
								<thead>
									<tr className="border-b-2">
										<td className="px-0 md:px-4 py-3">
											Order number
										</td>
										<td
											className="px-4 py-3"
											align="center">
											Total
										</td>
										<td
											className="px-4 py-3"
											align="center">
											Order Date
										</td>
										<td
											className="px-4 py-3"
											align="center">
											Order Status
										</td>
										<td
											className="px-4 py-3"
											align="center">
											Delivery
											Status
										</td>
										<td
											className="px-4 py-3"
											align="center"></td>
									</tr>
								</thead>
								<tbody>
									{orders
										?.filter(
											(item) =>
												item.isRefund ===
												true
										)
										?.map((order) => (
											<tr
												key={
													order.id
												}
												className="border-b-2">
												<td className="py-5">
													#{" "}
													{
														order.id
													}
												</td>
												<td align="center">
													{currencyFormat(
														order.total
													)}
												</td>
												<td align="center">
													{moment(
														order.orderDate
													).format(
														"MMM Do YY, h:mm a"
													)}
												</td>
												<td align="center">
													{
														order.orderStatus
													}
												</td>
												<td align="center">
													{order.deliveryStatus ===
													"PendingConfirm" ? (
														<div className="flex justify-center items-center">
															<TbGift
																size={
																	25
																}
																className="mr-3 text-indigo-600"
															/>{" "}
															Pending
															Confirm
														</div>
													) : order.deliveryStatus ===
													  "OnTheWay" ? (
														<div className="flex justify-center items-center">
															<RiTruckLine
																size={
																	25
																}
																className="mr-3 fill-red-600"
															/>{" "}
															On
															The
															Way
														</div>
													) : order.deliveryStatus ===
													  "ProductDelivered" ? (
														<div className="flex justify-center items-center">
															<TbHome2
																size={
																	25
																}
																className="mr-3 text-green-600"
															/>{" "}
															Delivered
														</div>
													) : (
														"Order Placed"
													)}
												</td>
												<td align="center">
													{/* <button
													className="c-btn"
													onClick={() =>
														setSelectedOrderNumber(
															order.id
														)
													}>
													View
												</button> */}
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</TabPanel>
					</Box>
				</div>

				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description">
					<Box sx={style}>
						<Typography
							id="modal-modal-title"
							variant="h6"
							component="h2">
							Delivery Status
						</Typography>
						<div id="modal-modal-description">
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="flex flex-col ">
								<select
									className="p-4 focus:outline-hidden"
									{...register(
										"deliveryStatus"
									)}
									name="deliveryStatus">
									<option value="choose-status">
										--- Confirm Delivery
										Status ---
									</option>
									<option value="OnTheWay">
										On The Way
									</option>
									{/* <option value="ProductDelivered">
										Product Delivered
									</option> */}
								</select>
								<input
									className="c-btn mt-5 cursor-pointer"
									type="submit"
									value="Submit"
								/>
							</form>
						</div>
					</Box>
				</Modal>
			</div>
		</div>
	);
};

export default AdminOrders;
