import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { IOrder } from "../../app/interfaces/IOrder";
import Loading from "../../app/layout/Loading";
import { currencyFormat } from "../../app/utilities/util";
import OrderDetailed from "./OrderDetailed";

const Order: React.FC = () => {
	const [orders, setOrders] = useState<IOrder[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);

	useEffect(() => {
		agent.Orders.list()
			.then((orders) => setOrders(orders))
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading message="Loading orders" />;

	if (selectedOrderNumber > 0)
		return (
			<OrderDetailed
				order={
					orders?.find(
						(o) =>
							o.id ===
							selectedOrderNumber
					)!
				}
				setSelectedOrder={setSelectedOrderNumber}
			/>
		);

	return (
		<div className="rounded-div mt-5 p-5">
				<table className="table-auto w-full">
					<thead>
						<tr>
							<td className='px-4 py-3'>
								Order number
							</td>
							<td className='px-4 py-3' align="center">
								Total
							</td>
							<td className='px-4 py-3' align="center">
								Order Date
							</td>
							<td className='px-4 py-3' align="center">
								Order Status
							</td>
							<td className='px-4 py-3' align="center"></td>
						</tr>
					</thead>
					<tbody>
						{orders?.map((order) => (
							<tr key={order.id}>
								<td className='py-4'>
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
									{
										order.orderDate.split(
											"T"
										)[0]
									}
								</td>
								<td align="center">
									{
										order.orderStatus
									}
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
		</div>
	);
};

export default Order;
