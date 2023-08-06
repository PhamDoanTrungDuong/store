import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AiOutlinePrinter } from "react-icons/ai";
import { IOrder } from "../interfaces/IOrder";
import moment from "moment";
import { currencyFormat } from "../utilities/util";

interface IProps {
	cancelExport: () => void;
	order: IOrder;
	shipper?: any;
}
const PDFPrint: React.FC<IProps> = ({ cancelExport, order, shipper }) => {
	let dateTime = new Date();
	const componentRef = useRef<any>();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: "emp-data",
		// onAfterPrint: () => alert("Print success"),
	});
	return (
		<>
			<div className="mt-24 rounded-div2">
				<div ref={componentRef} className="mx-auto text-black p-6">
					<div>
						<h1 className="text-3xl font-bold uppercase flex justify-center mt-3 ">
							Invoice
						</h1>
						<p className="flex justify-center my-5">
							---------------------------------------------------------------------------------
						</p>
						<h3 className="flex justify-center">
							{moment(order.orderDate).format(
								"MMMM Do YYYY , h:mm:ss a"
							)}
						</h3>
						<div className="p-4">
							<h3 className="my-1">
								<span className="text-lg font-medium">
									Customer Name
								</span>
								: {order.shippingAddress.fullName}
							</h3>
							<h3 className="my-1">
								<span className="text-lg font-medium">
									Address
								</span>
								: {order.shippingAddress.address1}
							</h3>
							<h3 className="my-1">
								<span className="text-lg font-medium">
									City
								</span>
								: {order.shippingAddress.city}
							</h3>
							<h3 className="my-1">
								<span className="text-lg font-medium">
									Country
								</span>
								: {order.shippingAddress.country}
							</h3>
							<h3 className="my-1">
								<span className="text-lg font-medium">
									OrderDate
								</span>
								:{" "}
								{moment(order.orderDate).format(
									"MMMM Do YYYY, h:mm:ss a"
								)}
							</h3>
							<h3 className="my-1">
								<span className="text-lg font-medium">
									Shipper Name
								</span>
								: {shipper.name}
							</h3>
							<h3 className="my-1">
								<span className="text-lg font-medium">
									Shipper Phone Number
								</span>
								: {shipper.phone}
							</h3>
						</div>
						<div>
							<table className="w-full mx-auto border mt-4">
								<thead>
									<tr className="border">
										<th
											align="left"
											className="px-5 md:px-20 pb-5">
											Product
										</th>
										<th
											align="center"
											className="px-5 md:px-10 pb-5">
											Price
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
									{order.orderItems.map(
										(item, idx) => (
											<tr
												className="border"
												key={
													item.productId
												}>
												<td className="py-4 border">
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
																height: 100,
																marginRight: 20,
															}}
														/>
														<span className="hidden md:block">
															{
																item.name
															}
														</span>
													</div>
												</td>

												<td
													align="center"
													className="border">
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
												<td
													align="center"
													className="border">
													{
														item.quantity
													}
												</td>
												<td
													align="center"
													className="border">
													<h5 className="font-bold">
														$
														{(
															(item.price *
																item.quantity) /
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
						</div>
						<div className="flex justify-end items-center mt-3">
							<h1>
								<span className="text-lg font-bold">
									Total
								</span>
								: {currencyFormat(order.total)}
							</h1>
						</div>
					</div>
				</div>
			</div>
			<div className="flex justify-between items-center mt-10">
				<button className="c-btn" onClick={cancelExport}>
					Back to Order
				</button>
				<button
					className="bg-[#AA0A00] border border-[#AA0A00] text-white text-md font-bold px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-[#AA0A00] duration-200 flex justify-center items-center gap-2"
					onClick={handlePrint}>
					<AiOutlinePrinter size={30} /> Print
				</button>
			</div>
		</>
	);
};

export default PDFPrint;
