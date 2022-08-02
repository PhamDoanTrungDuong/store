import { Grid, Typography } from "@mui/material";
import { BasketItem } from "../../app/interfaces/IBasket";
import { IOrder } from "../../app/interfaces/IOrder";
import BasketSumary from "../basket/BasketSumary";
import BasketTable from "../basket/BasketTable";

interface IProps {
	order: IOrder;
	setSelectedOrder: (id: number) => void;
}

const OrderDetailed: React.FC<IProps> = ({ order, setSelectedOrder }) => {
	const subtotal =
		order.orderItems.reduce(
			(sum, item) => sum + item.quantity * item.price,
			0
		) ?? 0;
	return (
		<div className="rounded-div mt-5 p-5">
			<div className="flex justify-between">
				<Typography
					sx={{ p: 2 }}
					gutterBottom
					variant="h4">
					Order# {order.id} - {order.orderStatus}
				</Typography>
				<div className="p-4">
					<button
						className="border text-white px-6 py-1 border-indigo-600 bg-indigo-600 text-lg rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out "
						onClick={() =>
							setSelectedOrder(0)
						}>
						Back to orders
					</button>
				</div>
			</div>
			<BasketTable
				items={order.orderItems as BasketItem[]}
				isBasket={false}
			/>
			<Grid container>
				<Grid item xs={6} />
				<Grid item xs={6}>
					<BasketSumary subtotal={subtotal} />
				</Grid>
			</Grid>
		</div>
	);
};

export default OrderDetailed;
