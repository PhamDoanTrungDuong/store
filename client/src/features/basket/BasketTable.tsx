import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import { LoadingButton } from "@mui/lab";
import { addBasketItemAsync, removeBasketItemAsync, setStateBasket } from "./basketSlice";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { BasketItem } from "../../app/interfaces/IBasket";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface IProps {
	items: BasketItem[];
	isBasket?: boolean;
}

const BasketTable: React.FC<IProps> = ({ items, isBasket = true }) => {
	const { status } = useAppSelector((state) => state.basket);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (status === "addSuccess") dispatch(setStateBasket());
	}, [dispatch, status]);

	return (
		<table className="max-w-[400px] sm:max-w-[500px] md:max-w-[600px]">
			<thead>
				<tr>
					<th align="left" className="px-5 md:px-20 pb-5">
						Product
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						Variations
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						Price
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						Quantity
					</th>
					<th align="center" className="px-5 md:px-10 pb-5">
						Subtotal
					</th>
					{isBasket && <th align="right"></th>}
				</tr>
			</thead>
			<tbody>
				{items.map((item, idx) => (
					<tr key={idx}>
						<td className="py-4">
							<Link to={`/catalog/${item.productId}`}>
								<div className="flex items-center">
									<img
										className="rounded-xl"
										src={
											item.pictureUrl
										}
										alt={item.name}
										style={{
											height: 100,
											marginRight: 20,
										}}
									/>
									<span className="hidden md:block">
										{item.name}
									</span>
								</div>
							</Link>
						</td>
						<td align="center" className="uppercase">
							{item.color}, {item.size}
						</td>
						<td align="center">
							${(item.price / 100).toFixed(2)}
						</td>
						<td align="center">
							<div className="flex flex-row justify-evenly items-center">
								{isBasket && (
									<button
										className="hover:text-red-600 p-2 border rounded-full"
										onClick={() => {
											dispatch(
												removeBasketItemAsync(
													{
														productId: item.productId,
														quantity: 1,
														name: "remove",
													}
												)
											);
										}}>
										<IoIosArrowBack />
									</button>
								)}
								<span>{item.quantity}</span>
								{isBasket && (
									<button
										className="hover:text-green-600 p-2 border rounded-full"
										onClick={() => {
											dispatch(
												addBasketItemAsync(
													{
														productId: item.productId,
														quantity: 1,
														color: item.color,
														size: item.size,
													}
												)
											);
										}}>
										<IoIosArrowForward />
									</button>
								)}
							</div>
						</td>
						<td align="center">
							$
							{(
								(item.price * item.quantity) /
								100
							).toFixed(2)}
						</td>
						{isBasket && (
							<td>
								<LoadingButton
									loading={
										status ===
										"pendingRemoveItem" +
											item.productId +
											"del"
									}
									onClick={() => {
										dispatch(
											removeBasketItemAsync(
												{
													productId: item.productId,
													quantity: item.quantity,
													name: "del",
												}
											)
										);
									}}
									color="error">
									<BsTrash />
								</LoadingButton>
							</td>
						)}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default BasketTable;
