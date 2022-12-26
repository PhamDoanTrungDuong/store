import { Box, Stepper, Step, StepLabel } from "@mui/material";
import { BasketItem } from "../../app/interfaces/IBasket";
import { IOrder } from "../../app/interfaces/IOrder";
import BasketSumary from "../basket/BasketSumary";
import BasketTable from "../basket/BasketTable";
import { TbGift, TbHome2 } from "react-icons/tb";
import { RiTruckLine } from "react-icons/ri";
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineFilePdf } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { FaHashtag } from "react-icons/fa";
import { Link } from "react-router-dom";
import PDFPrint from "../../app/components/PDFPrint";
import { useState } from "react";
import moment from "moment";
import { currencyFormat } from "../../app/utilities/util";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setOrdLoad } from "../admin/adminSlice";

interface IProps {
	order: IOrder;
	setSelectedOrder: (id: number) => void;
	isAdmin: boolean;
}

const OrderDetailed: React.FC<IProps> = ({ order, setSelectedOrder, isAdmin }) => {
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
		<div className={`${isAdmin ? "mt-24" : ""} p-5`}>
			<div className="flex items-center ml-2 mt-3 mb-8">
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
				<div className="mx-2">
					<IoIosArrowForward size={15} />
				</div>
				<Link to="/orders">
					<h1 className="flex items-center hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<FaHashtag size={15} />
						{order.id}
					</h1>
				</Link>
			</div>
			<div className="flex justify-between items-center mb-5">
				<div>
					<h4 className="hidden md:block text-xl font-bold uppercase mb-4">
						ORDER #{order.id} -{" "}
						{order.deliveryStatus === "CancelOrder" ||
						order.isRefund === true ? (
							<span className="p-2 bg-red-100 rounded-lg">
								<span className="text-red-700">
									Cancel Order
								</span>
							</span>
						) : order.deliveryStatus === "OnTheWay" ? (
							<span className="p-2 bg-blue-100 rounded-lg">
								<span className="text-blue-700">
									Comfirmed
								</span>
							</span>
						) : order.deliveryStatus === "ProductDelivered" ? (
							<span className="p-2 bg-green-100 rounded-lg">
								<span className="text-green-700">
									Delivered
								</span>
							</span>
						) : order.deliveryStatus === "PendingConfirm" ? (
							<span className="p-2 bg-yellow-100 rounded-lg">
								<span className="text-yellow-700">
									Pending
								</span>
							</span>
						) : (
							""
						)}
					</h4>
					<div>
						<h5 className="text-lg font-medium">
							Order Date:{" "}
							{moment(order.orderDate).format("lll")}
						</h5>
					</div>
				</div>

				{/* <div className="w-[55%]">
					<Box sx={{ width: "100%" }}>
						<Stepper
							activeStep={
								order.deliveryStatus ===
								"PendingConfirm"
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
												{
													label
												}
											</p>
										</div>
									</StepLabel>
								</Step>
							))}
						</Stepper>
					</Box>
				</div> */}
				<div className="p-4">
					<button
						className="border text-white px-6 py-1 border-indigo-600 bg-indigo-600 text-lg rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out mr-4"
						onClick={() => setSelectedOrder(0)}>
						Back to orders
					</button>
					{user?.roles?.includes("Admin") &&
					order.deliveryStatus === "PendingConfirm" &&
					order.isRefund === false ? (
						<button
							className="border text-white px-6 py-1 border-green-600 bg-green-600 text-lg rounded-lg hover:text-green-600 hover:bg-transparent duration-200 ease-in-out "
							onClick={() =>
								handleShipper(order.id, "OnTheWay")
							}>
							Deliver to Shipper
						</button>
					) : (
						""
					)}
				</div>
			</div>
			<div className="mt-10 flex justify-start gap-3">
				<div className="basis-3/5">
					<h1 className="text-lg font-extrabold">Delivery Address</h1>
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
							{/* {order.paymentIntentId !== null
								? order.shippingAddress.phoneNumber
								: (order.paymentIntentId === null && order.orderId === null)
								? order.shippingAddress.phoneNumber
								: "0" +
								  order.shippingAddress.phoneNumber} */}
								{order.shippingAddress.phoneNumber}
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
								: order.paymentIntentId !== null
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
			<div className="rounded-div2 flex flex-col md:flex-row gap-3 mt-10">
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
			{isAdmin ? (
				<div className="flex justify-end items-center mt-3">
					<div className="group">
						<button
							className="border text-white px-3 py-1 border-[#AA0A00] bg-[#AA0A00] text-lg rounded-lg group-hover:text-[#AA0A00] group-hover:bg-transparent duration-200 ease-in-out flex justify-center items-center gap-2"
							onClick={handlePDF}>
							<AiOutlineFilePdf
								size={30}
								className="text-white p-0 duration-200 ease-in-out group-hover:text-[#AA0A00]"
							/>{" "}
							Export
						</button>
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default OrderDetailed;
