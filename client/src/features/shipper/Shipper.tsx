import React, { useEffect, useState } from "react";
// import Loading from "../../app/layout/Loading";
import { currencyFormat } from "../../app/utilities/util";
import OrderDetailed from "../orders/OrderDetailed";
import Box from "@mui/material/Box";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import moment from "moment";
import { FiEye } from "react-icons/fi";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { fetchOrdersAsync } from "../admin/adminSlice";
import ShipperDetailed from "./ShipperDetailed";

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

const Shipper = () => {
	const dispatch = useAppDispatch();
	const [value, setValue] = React.useState(0);
	const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const { orders, loadOrder } = useAppSelector((state) => state.admin);
	useEffect(() => {
		!loadOrder ? dispatch(fetchOrdersAsync()) : dispatch(fetchOrdersAsync());
	}, [dispatch, loadOrder]);

	if (selectedOrderNumber > 0)
		return (
			<ShipperDetailed
				order={orders?.find((o) => o.id === selectedOrderNumber)!}
				setSelectedOrder={setSelectedOrderNumber}
				isAdmin={true}
			/>
		);

	return (
		<div className="mt-24 h-full w-[60%] mx-auto p-5">
			<div>
				<div className="h-[100px] flex justify-center items-center bg-green-500">
					<span className="text-3xl text-white font-bold">
						My Shipments
					</span>
				</div>
				<div>
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
									label="All"
									{...a11yProps(0)}
								/>
								<Tab
									label="On the Way"
									{...a11yProps(1)}
								/>
								<Tab
									label="Delivered"
									{...a11yProps(2)}
								/>
								<Tab
									label="Refunded"
									{...a11yProps(3)}
								/>
							</Tabs>
						</Box>
						<div className="h-full overflow-y-scroll">
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
													Address
												</td>
												<td
													className="px-4 py-3"
													align="center">
													Total
												</td>
												{/* <td
												className="px-4 py-3"
												align="center">
												Order
												Status
											</td> */}
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
														item.deliveryStatus !==
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
																		.address1
																}
															</td>
															<td align="center">
																{currencyFormat(
																	order.total
																)}
															</td>

															{/* <td align="center">
															{
																order.orderStatus
															}
														</td> */}
															<td align="center">
																{order.deliveryStatus ===
																	"CancelOrder" ||
																order.isRefund ===
																	true ? (
																	<span className="p-2 bg-red-100 rounded-lg">
																		<span className="text-red-700 font-medium">
																			Cancel
																			Order
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "OnTheWay" ? (
																	<span className="p-2 bg-blue-100 rounded-lg">
																		<span className="text-blue-700 font-medium">
																			On
																			The
																			Way
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "ProductDelivered" ? (
																	<span className="p-2 bg-green-100 rounded-lg">
																		<span className="text-green-700 font-medium">
																			Delivered
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "PendingConfirm" ? (
																	<span className="p-2 bg-yellow-100 rounded-lg">
																		<span className="text-yellow-700 font-medium">
																			Pending
																		</span>
																	</span>
																) : (
																	""
																)}
															</td>
															<td align="center">
																<div
																	className="p-2 hover:bg-indigo-200/30 rounded-full duration-200 cursor-pointer"
																	onClick={() =>
																		setSelectedOrderNumber(
																			order.id
																		)
																	}>
																	<Tooltip
																		TransitionComponent={
																			Zoom
																		}
																		title="View">
																		<FiEye
																			className="text-indigo-600"
																			size={
																				20
																			}
																		/>
																	</Tooltip>
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
												{/* <td
												className="px-4 py-3"
												align="center">
												Order
												Status
											</td> */}
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
															{/* <td align="center">
															{
																order.orderStatus
															}
														</td> */}
															<td align="center">
																{order.deliveryStatus ===
																	"CancelOrder" ||
																order.isRefund ===
																	true ? (
																	<span className="p-2 bg-red-100 rounded-lg">
																		<span className="text-red-700 font-medium">
																			Cancel
																			Order
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "OnTheWay" ? (
																	<span className="p-2 bg-blue-100 rounded-lg">
																		<span className="text-blue-700 font-medium">
																			On
																			The
																			Way
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "ProductDelivered" ? (
																	<span className="p-2 bg-green-100 rounded-lg">
																		<span className="text-green-700 font-medium">
																			Delivered
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "PendingConfirm" ? (
																	<span className="p-2 bg-yellow-100 rounded-lg">
																		<span className="text-yellow-700 font-medium">
																			Pending
																		</span>
																	</span>
																) : (
																	""
																)}
															</td>
															<td
																align="center"
																// className="flex justify-center items-center mt-[30%]"
															>
																{/* <button
																className="p-2 hover:bg-yellow-200/30 rounded-full duration-200 cursor-pointer"
																onClick={() => {
																	handleOpen();
																	setSelectedDeli(
																		order.id
																	);
																}}>
																<Tooltip TransitionComponent={Zoom} title="Change Status">
																		<FiShoppingCart
																			size={
																				20
																			}
																			className="text-yellow-500"
																		/>
																	</Tooltip>
															</button> */}
																<div
																	className="p-2 hover:bg-indigo-200/30 rounded-full duration-200 cursor-pointer"
																	onClick={() =>
																		setSelectedOrderNumber(
																			order.id
																		)
																	}>
																	<Tooltip
																		TransitionComponent={
																			Zoom
																		}
																		title="View">
																		<FiEye
																			className="text-indigo-600"
																			size={
																				20
																			}
																		/>
																	</Tooltip>
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
												{/* <td
												className="px-4 py-3"
												align="center">
												Order
												Status
											</td> */}
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
															{/* <td align="center">
															{
																order.orderStatus
															}
														</td> */}
															<td align="center">
																{order.deliveryStatus ===
																	"CancelOrder" ||
																order.isRefund ===
																	true ? (
																	<span className="p-2 bg-red-100 rounded-lg">
																		<span className="text-red-700 font-medium">
																			Cancel
																			Order
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "OnTheWay" ? (
																	<span className="p-2 bg-blue-100 rounded-lg">
																		<span className="text-blue-700 font-medium">
																			On
																			The
																			Way
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "ProductDelivered" ? (
																	<span className="p-2 bg-green-100 rounded-lg">
																		<span className="text-green-700 font-medium">
																			Delivered
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "PendingConfirm" ? (
																	<span className="p-2 bg-yellow-100 rounded-lg">
																		<span className="text-yellow-700 font-medium">
																			Pending
																		</span>
																	</span>
																) : (
																	""
																)}
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
													Full
													Name
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
												{/* <td
												className="px-4 py-3"
												align="center">
												Order
												Status
											</td> */}
												<td
													className="px-4 py-3"
													align="center">
													Delivery
													Status
												</td>
											</tr>
										</thead>
										<tbody>
											{orders
												?.filter(
													(
														item
													) =>
														item.isRefund ===
															true ||
														item.deliveryStatus ===
															"CancelOrder"
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
															{/* <td align="center">
															Refund
														</td> */}
															<td align="center">
																{order.deliveryStatus ===
																	"CancelOrder" ||
																order.isRefund ===
																	true ? (
																	<span className="p-2 bg-red-100 rounded-lg">
																		<span className="text-red-700 font-medium">
																			Cancel
																			Order
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "OnTheWay" ? (
																	<span className="p-2 bg-blue-100 rounded-lg">
																		<span className="text-blue-700 font-medium">
																			On
																			The
																			Way
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "ProductDelivered" ? (
																	<span className="p-2 bg-green-100 rounded-lg">
																		<span className="text-green-700 font-medium">
																			Delivered
																		</span>
																	</span>
																) : order.deliveryStatus ===
																  "PendingConfirm" ? (
																	<span className="p-2 bg-yellow-100 rounded-lg">
																		<span className="text-yellow-700 font-medium">
																			Pending
																		</span>
																	</span>
																) : (
																	""
																)}
															</td>
														</tr>
													)
												)}
										</tbody>
									</table>
								</TabPanel>
							</Box>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Shipper;
