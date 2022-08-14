import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { IOrder } from "../../app/interfaces/IOrder";
import Loading from "../../app/layout/Loading";
import { currencyFormat } from "../../app/utilities/util";
import OrderDetailed from "../orders/OrderDetailed";

const AdminOrders: React.FC = () => {
	const [orders, setOrders] = useState<IOrder[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);

	useEffect(() => {
		agent.Admin.getOrder()
			.then((orders) => setOrders(orders))
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading message="Loading orders" />;

	if (selectedOrderNumber > 0)
		return (
			<OrderDetailed
				order={orders?.find((o) => o.id === selectedOrderNumber)!}
				setSelectedOrder={setSelectedOrderNumber}
			/>
		);

	return (
		<div className="mt-5 p-5">
			<h4 className="text-2xl font-bold my-4">Orders</h4>
			<div className="h-[500px] overflow-y-scroll">
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Order number</TableCell>
								<TableCell>Fullname</TableCell>
								<TableCell>City</TableCell>
								<TableCell>Address</TableCell>
								<TableCell align="center">Total</TableCell>
								<TableCell align="center">
									Order Date
								</TableCell>
								<TableCell align="center">
									Order Status
								</TableCell>
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
										{
											order
												.shippingAddress
												.fullName
										}
									</TableCell>
									<TableCell>
										{order.shippingAddress.city}
									</TableCell>
									<TableCell>
										{
											order
												.shippingAddress
												.address1
										}
									</TableCell>
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
										<Button
											onClick={() =>
												setSelectedOrderNumber(
													order.id
												)
											}>
											View
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default AdminOrders;
