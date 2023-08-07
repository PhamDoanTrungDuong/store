import React, { useEffect, useState } from "react";
import { BasketItem } from "../../app/interfaces/IBasket";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import useProducts from "../../app/hooks/useProducts";
import { IProductDiscount } from "../../app/interfaces/IProduct";
import { FiTrash2 } from "react-icons/fi";
import { BiCommentEdit } from "react-icons/bi";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { IOrder } from "../../app/interfaces/IOrder";
import agent from "../../app/api/agent";
interface IProps {
	order?: IOrder;
	item: BasketItem;
	statusOrder?: string;
	isBasket?: boolean;
}
const BasketTableItem: React.FC<IProps> = ({ item, isBasket, statusOrder, order }) => {
	const dispatch = useAppDispatch();
	const { status } = useAppSelector((state) => state.basket);
	const { user } = useAppSelector((state) => state.account);

	// console.log(statusOrder);
	const { productDiscount } = useProducts();
	const [itemSales, setItemSales] = useState<IProductDiscount>();
	const [itemOrder, setItemOrder] = useState<any>();

	useEffect(() => {
		productDiscount.filter((e: any) => {
			if (item.productId && e.productId === item.productId) {
				setItemSales(e);
			}
			return item.productId;
		});
		// (!isBasket && +order!.id !== undefined) && agent.Orders.getOrder(+order!.id)
		// 					.then((res) => setItemOrder(res))
		// 					.catch((err) => console.log(err));
	}, [productDiscount, item.productId]);

	return (
		<>
			<td className="py-4">
				<Link to={`/catalog/${item.productId}`}>
					<div className="flex items-center">
						<img
							className="rounded-xl"
							src={item.pictureUrl}
							alt={item.name}
							style={{
								height: 100,
								marginRight: 20,
							}}
						/>
						<span className="hidden md:block">{item.name}</span>
					</div>
				</Link>
			</td>
			<td align="center" className="uppercase">
				{item.color}, {item.size}
			</td>
			<td align="center">
				{itemSales?.discountValue ? (
					<>
						<div className="text-lg font-bold">
							<h5 className="text-gray-400 font-bold line-through">
								$
								{(itemSales.price / 100).toFixed(2)}
							</h5>
							<h5 className="font-bold">
								$
								{(
									itemSales.price / 100 -
									(itemSales.price *
										(itemSales.discountValue /
											100)) /
										100
								).toFixed(2)}
							</h5>
						</div>
					</>
				) : (
					<h5 className="text-lg font-bold">
						${(item.price / 100).toFixed(2)}
					</h5>
				)}
			</td>
			<td align="center">
				<div className="flex flex-row justify-evenly items-center">
					{isBasket && (
						<button
							className="hover:text-red-600 p-2 border rounded-full"
							onClick={() => {
								dispatch(
									removeBasketItemAsync({
										productId: item.productId,
										quantity: 1,
										name: "remove",
									})
								);
							}}>
							<IoIosArrowBack />
						</button>
					)}
					<span>x{item.quantity}</span>
					{isBasket && (
						<button
							className="hover:text-green-600 p-2 border rounded-full"
							onClick={() => {
								dispatch(
									addBasketItemAsync({
										productId: item.productId,
										quantity: 1,
										color: item.color,
										size: item.size,
									})
								);
							}}>
							<IoIosArrowForward />
						</button>
					)}
				</div>
			</td>
			<td align="center">
				{itemSales?.discountValue ? (
					<>
						<h5 className="font-bold">
							$
							{(
								(itemSales.price * item.quantity) /
									100 -
								(itemSales.price *
									item.quantity *
									(itemSales.discountValue /
										100)) /
									100
							).toFixed(2)}
						</h5>
					</>
				) : (
					<h5 className="font-bold">
						${((item.price * item.quantity) / 100).toFixed(2)}
					</h5>
				)}
			</td>
			{(statusOrder === "ProductDelivered") &&
				 !(user?.roles?.includes("Admin") || user?.roles?.includes("Moderator")) && (
					<td align="center">
						<Link to={`/catalog/${item.productId}`}>
							<div
								// onClick={focusOnComponent}
								className="p-2 hover:bg-indigo-200/30 rounded-full duration-200 cursor-pointer">
								<Tooltip
									TransitionComponent={
										Zoom
									}
									title="Comment">
									<BiCommentEdit
										className="text-green-600"
										size={30}
									/>
								</Tooltip>
							</div>
						</Link>
					</td>
				 )
				// itemOrder && itemOrder.map((irt: any) => {
				// 		(irt.productId !== item.productId) ? 
				// 		(
				// 			<td align="center">
				// 				<Link to={`/catalog/${item.productId}`}>
				// 					<div
				// 						// onClick={focusOnComponent}
				// 						className="p-2 hover:bg-indigo-200/30 rounded-full duration-200 cursor-pointer">
				// 						<Tooltip
				// 							TransitionComponent={
				// 								Zoom
				// 							}
				// 							title="Comment">
				// 							<BiCommentEdit
				// 								className="text-green-600"
				// 								size={30}
				// 							/>
				// 						</Tooltip>
				// 					</div>
				// 				</Link>
				// 			</td>
				// 		) : (
				// 			<td align="center"></td>
				// 		);
				// })
			}
			{isBasket && (
				<td>
					<div
						className="p-2 hover:bg-red-300/30 rounded-full duration-200 cursor-pointer"
						onClick={() => {
							dispatch(
								removeBasketItemAsync({
									productId: item.productId,
									quantity: item.quantity,
									name: "del",
								})
							);
						}}>
						<FiTrash2 size={20} className="text-red-600" />
					</div>
				</td>
			)}
		</>
	);
};

export default BasketTableItem;
