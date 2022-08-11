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
		<div className=" mt-5 p-5">
			<div className="flex justify-between items-center mb-5">
				<h4 className="text-3xl">
					Order #{order.id} - {order.orderStatus}
				</h4>
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
			
			<div className="flex flex-row gap-3">
				<div className="basis-2/3 overflow-y-scroll scroll-smooth h-[500px]">
					<BasketTable items={order.orderItems as BasketItem[]}
							isBasket={false} />
				</div>
				<div className="basis-1/3">
						<BasketSumary subtotal={subtotal} />
				</div>
			</div>
		</div>
	);
};

export default OrderDetailed;
