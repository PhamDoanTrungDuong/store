import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { IOrder } from "../../app/interfaces/IOrder";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utilities/util";
import OrderDetailed from "./OrderDetailed";
import { fetchMemberTotal } from "./orderSlice";
import { BiPurchaseTag } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { IoIosArrowForward, IoMdArrowDropup } from "react-icons/io";
import { TbGift, TbHome2 } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";

import { RiTruckLine } from "react-icons/ri";
import { AiOutlineHome, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";
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

const Order: React.FC = () => {
	const [value, setValue] = useState(0);
	const [open, setOpen] = useState(false);
	const [currentOrder, setCurrentOrder] = useState<any>();
	const [momoOrderQuery, setMomoOrderQuery] = useState<any>();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	const [orders, setOrders] = useState<IOrder[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);
	const dispatch = useAppDispatch();
	const { memberTotal } = useAppSelector((state) => state.order);

	useEffect(() => {
		loading
			? agent.Orders.list()
					.then((orders) => {
						setOrders(orders);
					})
					.catch((error) => console.log(error))
					.finally(() => setLoading(false))
			: agent.Orders.list()
					.then((orders) => {
						setOrders(orders);
					})
					.catch((error) => console.log(error))
					.finally(() => setLoading(false));

		dispatch(fetchMemberTotal());
	}, [dispatch, loading]);

	if (loading) return <Loading message="Loading orders" />;

	if (selectedOrderNumber > 0)
		return (
			<OrderDetailed
				order={orders?.find((o) => o.id === selectedOrderNumber)!}
				setSelectedOrder={setSelectedOrderNumber}
			/>
		);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleMomoQuery = (Id: number) => {
		agent.Payments.momoQuery(Id).then((res) => {
			setMomoOrderQuery(res);
		});
	};
	const handleMomoRefund = (Id: number) => {
		agent.Payments.momoRefund(Id).then((res) => {
			console.log(res);
			Swal.fire({
				icon: "success",
				title: "Your order has been refunded, please wait for the system to process",
				showConfirmButton: false,
				timer: 2500,
			});
		});
	};

	const handleClose = () => {
		setOpen(false);
	};

	// console.log("[Orders]: ", orders);
	// console.log("[currentOrder]: ", currentOrder);
	return (
		<div className=" mt-5 p-5">
			<div className="flex items-center ml-2 mt-3 mb-5">
				<Link to="/">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineHome size={20} />
						Home
					</h1>
				</Link>
				<div className="mx-2">
					<IoIosArrowForward size={15} />
				</div>
				<Link to="/orders">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineShoppingCart size={20} />
						Orders
					</h1>
				</Link>
			</div>
			<div className="text-white bg-gradient-to-r from-indigo-600 to-indigo-400 px-8 py-6 rounded-[30px] w-[100%] md:w-[30%] mb-4">
				<div className="flex justify-between mb-3">
					<div className="p-3 bg-white text-indigo-600 rounded-2xl inline-block">
						<BiPurchaseTag size={25} />
					</div>
					<BsThreeDots className="cursor-pointer" size={20} />
				</div>
				<div className="relative mt-5">
					<div className="text-3xl font-bold">
						<p>{currencyFormat(memberTotal)}</p>
					</div>
					<div className="flex font-medium justify-between items-center mt-1">
						<h1 className="text-lg">Purchase</h1>
						<button className="py-2 px-4 hover:shadow-indigo-900 duration-300 bg-indigo-500 shadow-md rounded-full flex">
							+2,36% <IoMdArrowDropup size={20} />
						</button>
					</div>
				</div>
			</div>
			<div className="h-[600px] overflow-y-scroll">
				<Box sx={{ width: "100%" }}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
					<TabPanel value={value} index={0}>
						<table className="table-auto w-full text-xs sm:text-sm md:text-base">
							<thead>
								<tr className="border-b-2">
									<td className="px-0 md:px-4 py-3">
										Order number
									</td>
									<td
										className="px-4 py-3"
										align="center">
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
										Delivery Status
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
											item.deliveryStatus ===
												"PendingConfirm" &&
											item.isRefund ===
												false
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
												{order.shippingAddress.address1}
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
											<td align="right">
												{order.orderId && (
													<button
														className="bg-[#A50064] border border-[#A50064] text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-[#A50064] duration-200 mr-3"
														onClick={() => {
															handleClickOpen();
															handleMomoQuery(
																order.id
															);
															setCurrentOrder(
																order
															);
														}}>
														Refund
													</button>
												)}
												<button
													className="c-btn"
													onClick={() =>
														setSelectedOrderNumber(
															order.id
														)
													}>
													View
												</button>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<table className="table-auto w-full text-xs sm:text-sm md:text-base">
							<thead>
								<tr className="border-b-2">
									<td className="px-0 md:px-4 py-3">
										Order number
									</td>
									<td
										className="px-4 py-3"
										align="center">
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
										Delivery Status
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
											item.deliveryStatus ===
												"OnTheWay" &&
											item.isRefund ===
												false
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
												{order.shippingAddress.address1}
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
												<button
													className="c-btn"
													onClick={() =>
														setSelectedOrderNumber(
															order.id
														)
													}>
													View
												</button>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</TabPanel>
					<TabPanel value={value} index={2}>
						<table className="table-auto w-full text-xs sm:text-sm md:text-base">
							<thead>
								<tr className="border-b-2">
									<td className="px-0 md:px-4 py-3">
										Order number
									</td>
									<td
										className="px-4 py-3"
										align="center">
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
										Delivery Status
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
											item.deliveryStatus ===
												"ProductDelivered" &&
											item.isRefund ===
												false
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
												{order.shippingAddress.address1}
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
												<button
													className="c-btn"
													onClick={() =>
														setSelectedOrderNumber(
															order.id
														)
													}>
													View
												</button>
											</td>
										</tr>
									))}
							</tbody>
						</table>
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
										Delivery Status
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
			{momoOrderQuery && (
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description">
					<DialogTitle id="alert-dialog-title">
						{`Transaction Refund #${momoOrderQuery?.transId}`}
					</DialogTitle>
					<DialogContent>
						<table className="max-w-[400px] sm:max-w-[500px] md:max-w-[600px]">
							<thead>
								<tr>
									<th
										align="left"
										className="px-5 md:px-20 pb-5">
										Product
									</th>
									<th
										align="center"
										className="px-5 md:px-10 pb-5">
										Quantity
									</th>
									<th
										align="center"
										className="px-5 md:px-10 pb-5">
										Subtotal
									</th>
								</tr>
							</thead>
							<tbody>
								{currentOrder.orderItems.map(
									(item: any) => (
										<tr
											key={
												item.productId
											}>
											<td className="py-4">
												<Link
													to={`/catalog/${item.productId}`}>
													<div className="flex items-center">
														<img
															className="rounded-xl"
															src={
																item.pictureUrl
															}
															alt={
																item.name
															}
															style={{
																height: 80,
																marginRight: 20,
															}}
														/>
														<span className="hidden md:block">
															{
																item.name
															}
														</span>
													</div>
												</Link>
											</td>
											<td align="center">
												{
													item.quantity
												}
											</td>
											<td align="center">
												<h5 className="text-lg font-bold">
													$
													{(
														item.price /
														100
													).toFixed(
														2
													)}
												</h5>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
						Price: {currencyFormat(momoOrderQuery.amount)}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Disagree</Button>
						<Button
							onClick={() => {
								handleClose();
								handleMomoRefund(currentOrder.id);
							}}
							autoFocus>
							Agree
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</div>
	);
};

export default Order;
