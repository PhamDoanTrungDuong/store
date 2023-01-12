import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoIosCart } from "react-icons/io";
import { Link } from "react-router-dom";
import useProducts from "../../app/hooks/useProducts";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, setStateBasket } from "../basket/basketSlice";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import HeadDealOfDay from "../../app/components/TimeCountDown";
import agent from "../../app/api/agent";

const ProductDiscount: React.FC = () => {
	const dispatch = useAppDispatch();

	const { productDiscount } = useProducts();
	// console.log(productDiscount)
	const { status } = useAppSelector((state) => state.basket);
	const [userLikedProduct, setUserLikedProduct] = useState<any>();
	const [likeStatus, setLikeStatus] = useState<boolean>();

	useEffect(() => {
		agent.Like.getCurrentLike()
			.then((res: any) => {
				setUserLikedProduct(res);
			})
			.finally(() => {
				setLikeStatus(false);
			});
	}, [likeStatus]);

	const handleLike = async (productId: number) => {
		await agent.Like.addLike(productId).then(() => {
			Swal.fire({
				icon: "success",
				// title: "Like Product Successful",
				showConfirmButton: false, 
				timer: 1500,
			});
		});
	};

	useEffect(() => {
		if (status === "addSuccess") {
			Swal.fire({
				icon: "success",
				title: "Added Product Successful",
				showConfirmButton: false,
				timer: 1500,
			});
		}
		return () => {
			dispatch(setStateBasket());
		};
	}, [dispatch, status]);

	return (
		<div className="w-full mb-32 mt-10">
			<div className="max-w-[1140px] mx-auto">
				<div className="text-center">
					<h2 className="text-4xl capitalize font-bold">
						Sales Product
					</h2>
				</div>
				<div>
					<HeadDealOfDay />
				</div>
				{/* <div className='overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'> */}
				<div className="my-6 grid sm:grid-cols-3 md:grid-cols-4 gap-4">
					{productDiscount.slice(0, 4).map((item) => {
						return (
							<div
								key={item.productId}
								className="border rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 duration-300">
								<div>
									<Link
										to={`/catalog/${item.productId}`}>
										<div className="relative">
											<img
												className="h-full w-full object-contain rounded-t-xl"
												src={
													item.pictureUrl
												}
												alt={
													item.productName
												}
											/>
											{item?.quantityInStock! <
											1 ? (
												<img
													src="./images/out-of-stock-2.png"
													alt={
														item.productName
													}
													className="absolute top-0 left-3 w-[22%]"
												/>
											) : (
												""
											)}
											{item?.discountValue! !==
											0 ? (
												<>
													<img
														src="./images/discount.png"
														alt={
															item.productName
														}
														className="absolute top-[-1px] right-3 w-[30%]"
													/>
													<p className="text-white rotate-6 font-bold text-xl absolute top-[23px] right-[47px] z-10">
														{
															item?.discountValue
														}
													</p>
												</>
											) : (
												""
											)}
										</div>
									</Link>
									<div className="p-4">
										<Link
											to={`/catalog/${item.productId}`}>
											<div className="text-lg font-medium">
												{
													item.productName
												}
											</div>
										</Link>
										<div className="py-3">
											<h5 className="text-sm text-gray-400 cursor-pointer">
												{
													item.brand
												}{" "}
												/{" "}
												{
													item.type
												}
											</h5>
										</div>

										<div className="flex justify-between items-center">
											<div className="flex justify-start gap-2 items-center">
												<h5 className="text-md text-gray-400 font-bold line-through">
													$
													{(
														item.price /
														100
													).toFixed(
														2
													)}
												</h5>
												<h5 className="text-md font-bold">
													$
													{(
														item.price /
															100 -
														(item.price *
															(item.discountValue /
																100)) /
															100
													).toFixed(
														2
													)}
												</h5>
											</div>
											<div className="flex items-center">
												<button
													onClick={() => {
														handleLike(
															item.productId
														);
														setLikeStatus(
															true
														);
													}}
													className="p-2 hover:bg-red-100 rounded-full duration-300">
													<FaHeart
														size="20"
														className={
															userLikedProduct?.find(
																(
																	like: any
																) =>
																	like.likedProductId ===
																		item.productId &&
																	like.isLike ===
																		true
															)
																? "text-red-600 duration-300"
																: "text-gray-600 hover:text-red-600 duration-300"
														}
													/>
												</button>
												{!(
													item?.quantityInStock! <
													1
												) ? (
													<button
														className="p-1 rounded-full text-gray-600 hover:text-indigo-600 duration-300 hover:bg-indigo-100"
														onClick={() =>
															dispatch(
																addBasketItemAsync(
																	{
																		productId: item.productId,
																		color: "white",
																		size: "S",
																	}
																)
															)
														}>
														<IoIosCart size="30" />
													</button>
												) : (
													<Tooltip
														title="Out of stock"
														placement="top">
														<button className="p-2 cursor-default text-gray-600">
															<IoIosCart size="30" />
														</button>
													</Tooltip>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
		// </div>
	);
};

export default ProductDiscount;
