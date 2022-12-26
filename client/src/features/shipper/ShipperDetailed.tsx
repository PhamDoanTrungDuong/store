import { IOrder } from "../../app/interfaces/IOrder";
import PDFPrint from "../../app/components/PDFPrint";
import { useState } from "react";
import { currencyFormat } from "../../app/utilities/util";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { MdArrowBackIosNew } from "react-icons/md";
import agent from "../../app/api/agent";
import { setOrdLoad } from "../admin/adminSlice";

interface IProps {
	order: IOrder;
	setSelectedOrder: (id: number) => void;
	isAdmin: boolean;
}

const ShipperDetailed: React.FC<IProps> = ({ order, setSelectedOrder, isAdmin }) => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.account);

	const subtotal =
		order.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;
	const steps = ["Order Placed", "On The Way", "Product Delivered"];
	const [openPdf, setOpenPdf] = useState<boolean>(false);
	const handlePDF = () => {
		setOpenPdf(true);
	};

	const cancelExport = () => {
		setOpenPdf(false);
	};

	if (openPdf) {
		return <PDFPrint cancelExport={cancelExport} order={order} />;
	}

	const handleShipper = (idOrder: number, deliveryOrder: string) => {
		var data = { id: idOrder, deliveryStatus: deliveryOrder };
		console.log(data);
		agent.Orders.statusDelivery(data).then(() => {
			dispatch(setOrdLoad());
			setSelectedOrder(0);
		});
	};

	return (
		<div className="mt-24 h-full w-[60%] mx-auto p-5">
			<div>
				<div className="flex justify-start items-center mb-5">
					<div className="p-4">
						<button
							className="border text-white px-6 py-1 border-indigo-600 bg-indigo-600 text-lg rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out mr-4"
							onClick={() => setSelectedOrder(0)}>
							<MdArrowBackIosNew size={20} />
						</button>
					</div>
					<div>
						<span className="text-lg font-medium">Code Orders: #{order.id}</span>
					</div>
				</div>
				<div className="rounded-div p-3 flex justify-start gap-3">
					<div className="basis-3/5">
						<h1 className="text-lg font-extrabold">
							Delivery Address
						</h1>
						<div className="p-5 rounded-xl shadow-xl">
							<div className="my-3">
								<span className="font-bold text-base mr-4">
									Recipient:{" "}
								</span>{" "}
								{order.shippingAddress.fullName}
							</div>
							<div className="my-3">
								<span className="font-bold text-base mr-4">
									Phone Number:{" "}
								</span>{" "}
								{order.paymentIntentId !== null
									? order.shippingAddress
											.phoneNumber
									: order.paymentIntentId ===
											null &&
									  order.orderId === null
									? order.shippingAddress
											.phoneNumber
									: "0" +
									  order.shippingAddress
											.phoneNumber}
								{/* 0{order.shippingAddress.phoneNumber} */}
							</div>
							<div className="my-3">
								<span className="font-bold text-base mr-4">
									Address:{" "}
								</span>{" "}
								{order.shippingAddress.address1}
							</div>
						</div>
					</div>
					<div className="basis-2/5">
						<h1 className="text-lg font-extrabold">
							Billing Infomation
						</h1>
						<div className="p-5 rounded-xl shadow-xl">
							<div className="my-3">
								<span className="font-bold text-base mr-4">
									Payments:{" "}
								</span>{" "}
								{order.orderId !== null
									? "Momo payment method"
									: order.paymentIntentId !==
									  null
									? "Stripe payment method"
									: order.isVnPay === true
									? "Vnpay payment method"
									: "Cash payment"}
							</div>
							<div className="my-3">
								<span className="font-bold text-base mr-4">
									Discount:{" "}
								</span>{" "}
								...
							</div>
							<div className="my-3">
								<span className="font-bold text-base mr-4">
									Amount to be paid:{" "}
								</span>{" "}
								{currencyFormat(order.total)}
							</div>
						</div>
					</div>
				</div>
				<div className="rounded-div p-3 mt-5">
					<div className="p-5">
						{order.orderItems.map((item) => {
							return (
								<div>
									<div className="flex items-center gap-4 my-5">
										<div>
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
										</div>
										<div className="flex-row">
											<div className="flex justify-between w-[300px]">
												<div className="hidden md:block">
													{
														item.name
													}
												</div>
												<div className="ml-8">
													$
													{(
														item.price /
														100
													).toFixed(
														2
													)}
												</div>
											</div>
											<div>
												x
												{
													item.quantity
												}
											</div>
										</div>
									</div>
								</div>
							);
						})}
						<div className="flex justify-end items-end">
							<div>
								<p className="text-lg font-medium my-4">
									Discount: <span>...</span>
								</p>
								<p className="text-lg font-medium">
									Total:{" "}
									<span>
										{currencyFormat(
											subtotal
										)}
									</span>
								</p>
							</div>
						</div>
					</div>
					<div className="flex justify-end items-center gap-4">
						<div>
							<p className="text-lg font-bold">
								Fee:{" "}
								{order.orderId !== null
									? "$0"
									: order.paymentIntentId !==
									  null
									? "$0"
									: order.isVnPay === true
									? "$0"
									: currencyFormat(subtotal)}
							</p>
						</div>
						<button
							disabled={order.deliveryStatus !== "OnTheWay" ? true : false}
							className="border text-white px-6 py-1 border-red-600 bg-red-600 text-lg rounded-lg hover:text-red-600 hover:bg-transparent duration-200 ease-in-out "
							onClick={() =>
								handleShipper(
									order.id,
									"CancelOrder"
								)
							}>
							Cancel Order
						</button>
						<button
							disabled={order.deliveryStatus !== "OnTheWay" ? true : false}
							className="border text-white px-6 py-1 border-green-600 bg-green-600 text-lg rounded-lg hover:text-green-600 hover:bg-transparent duration-200 ease-in-out "
							onClick={() =>
								handleShipper(
									order.id,
									"ProductDelivered"
								)
							}>
							Delivered
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShipperDetailed;
