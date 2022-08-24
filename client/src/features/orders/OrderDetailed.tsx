import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { BasketItem } from "../../app/interfaces/IBasket";
import { IOrder } from "../../app/interfaces/IOrder";
import BasketSumary from "../basket/BasketSumary";
import BasketTable from "../basket/BasketTable";
import { TbGift, TbHome2 } from "react-icons/tb";
import { RiTruckLine } from "react-icons/ri";

interface IProps {
	order: IOrder;
	setSelectedOrder: (id: number) => void;
}

const OrderDetailed: React.FC<IProps> = ({ order, setSelectedOrder }) => {
	const subtotal =
		order.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;
	const steps = ["Order Placed", "On The Way", "Product Delivered"];
	return (
		<div className=" mt-5 p-5">
			<div className="flex justify-between items-center mb-5">
				<div>
					<h4 className="hidden md:block text-3xl">
						Order #{order.id} - {order.orderStatus}
					</h4>
				</div>
				<div className="w-[55%]">
					<Box sx={{ width: "100%" }}>
						<Stepper
							activeStep={
								order.deliveryStatus ===
								"OrderPlaced"
									? 0
									: order.deliveryStatus ===
									  "OnTheWay"
									? 1
									: order.deliveryStatus ===
									  "ProductDelivered"
									? 3
									: 3
							}
							alternativeLabel>
							{steps.map((label) => (
								<Step key={label}>
									<StepLabel>
										<div className="flex justify-center items-center">
											<div>
												{label ===
												"Order Placed" ? (
													<TbGift
														size={
															30
														}
														className="mr-3 text-indigo-600"
													/>
												) : label ===
												"On The Way" ? (
													<RiTruckLine
														size={
															30
														}
														className="mr-3 fill-red-600"
													/>
												) : label ===
												"Product Delivered" ? (
													<TbHome2
														size={
															30
														}
														className="mr-3 text-green-600"
													/>
												) : (
													3
												)}
											</div>
											<p>
												{label}
											</p>
										</div>
									</StepLabel>
								</Step>
							))}
						</Stepper>
					</Box>
				</div>
				<div className="p-4">
					<button
						className="border text-white px-6 py-1 border-indigo-600 bg-indigo-600 text-lg rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out "
						onClick={() => setSelectedOrder(0)}>
						Back to orders
					</button>
				</div>
			</div>

			<div className="flex flex-col md:flex-row gap-3 mt-10">
				<div className="basis md:basis-2/3 overflow-y-scroll scroll-smooth h-[500px]">
					<BasketTable
						items={order.orderItems as BasketItem[]}
						isBasket={false}
					/>
				</div>
				<div className="basis md:basis-1/3">
					<BasketSumary subtotal={subtotal} />
				</div>
			</div>
		</div>
	);
};

export default OrderDetailed;
