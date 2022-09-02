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
import { RiTruckLine } from "react-icons/ri";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { fetchOrdersAsync, setOrdLoad } from "./adminSlice";
import OrderSearch from "../../app/components/OrderSearch";

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
	const {orders, loadOrder} = useAppSelector(state => state.admin)
	const dispatch = useAppDispatch();
	// const [loading, setLoading] = useState(true);
	const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);
	const [selectedDeli, setSelectedDeli] = useState<number>(0);
	const { register, handleSubmit } = useForm();
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		!loadOrder ? dispatch(fetchOrdersAsync()) : dispatch(fetchOrdersAsync());
	}, [dispatch, loadOrder])

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
			dispatch(setOrdLoad())
			setSelectedDeli(0);
			handleClose();
		});
	};

	return (
		<div className="mt-5 p-5">
			<div className="flex gap-2 justify-start items-center mb-5">
				<h4 className=" basis-1/4 text-2xl font-bold my-4">Orders</h4>
				<div className="basis-3/4 w-[40%]">
					<OrderSearch />
				</div>
			</div>
			<div className="h-[500px] overflow-y-scroll">
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Order number</TableCell>
								<TableCell>Fullname</TableCell>
								{/* <TableCell>City</TableCell>
								<TableCell>Address</TableCell> */}
								<TableCell align="center">
									Total
								</TableCell>
								<TableCell align="center">
									Order Date
								</TableCell>
								<TableCell align="center">
									Order Status
								</TableCell>
								<TableCell align="center">
									Delivery Status
								</TableCell>
								<TableCell align="center"></TableCell>
								<TableCell align="center"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{orders?.map((order) => (
								<TableRow
									key={order.id}
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
										# {order.id}
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
										{
											order.orderDate.split(
												"T"
											)[0]
										}
									</TableCell>
									<TableCell align="center">
										{order.orderStatus}
									</TableCell>
									<TableCell align="center">
										{order.deliveryStatus ===
										"OrderPlaced" ? (
											<div className="flex justify-center items-center">
												<TbGift
													size={
														25
													}
													className="mr-3 text-indigo-600"
												/>{" "}
												Order
												Placed
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
							))}
						</TableBody>
					</Table>
				</TableContainer>
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
									<option value="OrderPlaced">
										Order Placed
									</option>
									<option value="OnTheWay">
										OnTheWay
									</option>
									<option value="ProductDelivered">
										Product Delivered
									</option>
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
