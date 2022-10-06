import { TableContainer, Paper } from "@mui/material";
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
import { FiShoppingCart, FiEye } from "react-icons/fi";

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
				isAdmin={true}
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
		<div className="mt-24 p-5">
			<div className="flex items-center ml-2 mb-8">
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
			<div className="rounded-div2 p-0">
				<div className="flex gap-2 justify-between items-center mb-5 p-6">
					<div className="w-[30%]">
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
							<Tab
								label="Pending Orders"
								{...a11yProps(0)}
							/>
							<Tab label="Confirmed" {...a11yProps(1)} />
							<Tab label="Delivered" {...a11yProps(2)} />
							<Tab label="Refunded" {...a11yProps(3)} />
						</Tabs>
					</Box>
					<div className="h-[500px] overflow-y-scroll">
						<Box sx={{ width: "100%" }}>
							<TabPanel value={value} index={0}>
								<table className="table-auto w-full text-xs sm:text-sm md:text-base">
									<thead>
										<tr className="border-b border-gray-200">
											<td
												className="px-4 py-3"
												align="center">
												Order
												number
											</td>
											<td className="px-4 py-3">
												Fullname
											</td>
											<td className="px-4 py-3">
												City
											</td>
											<td className="px-4 py-3">
												Address
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Total
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Order
												Date
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Order
												Status
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
													<tr
														className="border-b border-gray-200"
														key={
															order.id
														}>
														<td
															className="py-9"
															align="center">
															#{" "}
															{
																order.id
															}
														</td>
														<td>
															<span className="font-bold capitalize">
																{
																	order
																		.shippingAddress
																		.fullName
																}
															</span>
														</td>
														<td>
															{
																order
																	.shippingAddress
																	.city
															}
														</td>
														<td>
															{
																order
																	.shippingAddress
																	.address1
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
																"MMM Do YY"
															)}
														</td>
														<td align="center">
															{
																order.orderStatus
															}
														</td>
														<td align="left">
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
														<td
															align="center"
															className="flex justify-center items-center mt-[35%]">
															<button
																className="p-2 hover:bg-yellow-200/30 rounded-full duration-200 cursor-pointer"
																onClick={() => {
																	handleOpen();
																	setSelectedDeli(
																		order.id
																	);
																}}>
																<FiShoppingCart
																	size={
																		20
																	}
																	className="text-yellow-500"
																/>
															</button>
															<div
																className="p-2 hover:bg-indigo-200/30 rounded-full duration-200 cursor-pointer"
																onClick={() =>
																	setSelectedOrderNumber(
																		order.id
																	)
																}>
																<FiEye
																	className="text-indigo-600"
																	size={
																		20
																	}
																/>
															</div>
														</td>
													</tr>
												)
											)}
									</tbody>
								</table>
							</TabPanel>
							<TabPanel value={value} index={1}>
								<table className="table-auto w-full text-xs sm:text-sm md:text-base">
									<thead>
										<tr className="border-b border-gray-200">
											<td
												className="px-4 py-3"
												align="center">
												Order
												number
											</td>
											<td className="px-4 py-3">
												Fullname
											</td>
											<td className="px-4 py-3">
												City
											</td>
											<td className="px-4 py-3">
												Address
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Total
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Order
												Date
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Order
												Status
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
													<tr
														className="border-b border-gray-200"
														key={
															order.id
														}>
														<td
															className="py-7"
															align="center">
															#{" "}
															{
																order.id
															}
														</td>
														<td>
															<span className="font-bold text-lg capitalize">
																{
																	order
																		.shippingAddress
																		.fullName
																}
															</span>
														</td>
														<td>
															{
																order
																	.shippingAddress
																	.city
															}
														</td>
														<td>
															{
																order
																	.shippingAddress
																	.address1
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
														<td align="left">
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
														<td
															align="center"
															className="flex justify-center items-center mt-[30%]">
															<button
																className="p-2 hover:bg-yellow-200/30 rounded-full duration-200 cursor-pointer"
																onClick={() => {
																	handleOpen();
																	setSelectedDeli(
																		order.id
																	);
																}}>
																<FiShoppingCart
																	size={
																		20
																	}
																	className="text-yellow-500"
																/>
															</button>
															<div
																className="p-2 hover:bg-indigo-200/30 rounded-full duration-200 cursor-pointer"
																onClick={() =>
																	setSelectedOrderNumber(
																		order.id
																	)
																}>
																<FiEye
																	className="text-indigo-600"
																	size={
																		20
																	}
																/>
															</div>
														</td>
													</tr>
												)
											)}
									</tbody>
								</table>
							</TabPanel>
							<TabPanel value={value} index={2}>
								<table className="table-auto w-full text-xs sm:text-sm md:text-base">
									<thead>
										<tr className="border-b border-gray-200">
											<td
												className="px-4 py-3"
												align="center">
												Order
												number
											</td>
											<td className="px-4 py-3">
												Fullname
											</td>
											<td className="px-4 py-3">
												City
											</td>
											<td className="px-4 py-3">
												Address
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Total
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Order
												Date
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Order
												Status
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
													<tr
														className="border-b border-gray-200"
														key={
															order.id
														}>
														<td
															className="py-7"
															align="center">
															#{" "}
															{
																order.id
															}
														</td>
														<td>
															<span className="font-bold text-lg capitalize">
																{
																	order
																		.shippingAddress
																		.fullName
																}
															</span>
														</td>
														<td>
															{
																order
																	.shippingAddress
																	.city
															}
														</td>
														<td>
															{
																order
																	.shippingAddress
																	.address1
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
														<td align="left">
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
																		className="mr-3 text-green-600 mb-1"
																	/>{" "}
																	Delivered
																</div>
															) : (
																"Order Placed"
															)}
														</td>
														<td
															align="center"
															className="flex justify-center items-center gap-2 mt-[50%]">
															<div
																className="p-2 hover:bg-indigo-200/30 rounded-full duration-200 cursor-pointer"
																onClick={() =>
																	setSelectedOrderNumber(
																		order.id
																	)
																}>
																<FiEye
																	className="text-indigo-600"
																	size={
																		20
																	}
																/>
															</div>
														</td>
													</tr>
												)
											)}
									</tbody>
								</table>
							</TabPanel>
							<TabPanel value={value} index={3}>
								<table className="table-auto w-full text-xs sm:text-sm md:text-base">
									<thead>
										<tr className="border-b border-gray-200">
											<td
												className="px-4 py-3"
												align="center">
												Order
												number
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Total
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Order
												Date
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Order
												Status
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
												(
													item
												) =>
													item.isRefund ===
													true
											)
											?.map(
												(
													order
												) => (
													<tr
														className="border-b border-gray-200"
														key={
															order.id
														}>
														<td
															className="py-7"
															align="center">
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
															Refund
														</td>
														<td align="center">
															Refund
														</td>
														<td align="center">
															<div
																className="p-2 hover:bg-indigo-200/30 rounded-full duration-200 cursor-pointer"
																onClick={() =>
																	setSelectedOrderNumber(
																		order.id
																	)
																}>
																<FiEye
																	className="text-indigo-600"
																	size={
																		20
																	}
																/>
															</div>
														</td>
													</tr>
												)
											)}
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
									onSubmit={handleSubmit(
										onSubmit
									)}
									className="flex flex-col ">
									<select
										className="p-4 focus:outline-hidden"
										{...register(
											"deliveryStatus"
										)}
										name="deliveryStatus">
										<option value="choose-status">
											--- Confirm
											Delivery
											Status ---
										</option>
										{value === 0 ? (
											<option value="OnTheWay">
												On
												The
												Way
											</option>
										) : value === 1 ? (
											<option value="ProductDelivered">
												Product
												Delivered
											</option>
										) : (
											""
										)}
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
		</div>
	);
};

export default AdminOrders;
