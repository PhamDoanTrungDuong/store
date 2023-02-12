import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoIosCart } from "react-icons/io";
import { Link } from "react-router-dom";
import useProducts from "../../app/hooks/useProducts";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, setStateBasket } from "../basket/basketSlice";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import agent from "../../app/api/agent";

const LikedProduct: React.FC = () => {
	const { status } = useAppSelector((state) => state.basket);

	const [userLikedProduct, setUserLikedProduct] = useState<any>();
	const [likeStatus, setLikeStatus] = useState<boolean>();
	const dispatch = useAppDispatch();

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
		await agent.Like.addLike(productId);
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
			<div className="max-w-[1140px] h-screen mx-auto">
				<div className="text-center">
					<h2 className="text-4xl capitalize font-bold">
						Liked Product
					</h2>
				</div>
				<div className="my-6 grid sm:grid-cols-3 md:grid-cols-4 gap-4">
					{userLikedProduct &&
						userLikedProduct.map((item: any) => {
							return (
								<div
									key={item.likedProductId}
									className="border rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 duration-300">
									<div>
										<Link
											to={`/catalog/${item.likedProductId}`}>
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
												{/* {item?.quantityInStock! <
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
												)} */}
												{/* {item?.discountValue! !==
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
												)} */}
											</div>
										</Link>
										<div className="p-4">
											<Link
												to={`/catalog/${item.likedProductId}`}>
												<div className="text-lg font-medium my-3">
													{
														item.productName
													}
												</div>
											</Link>

											<div className="flex justify-center items-center">
												<div className="flex items-center gap-5">
													<button 
														onClick={() => {
															handleLike(item.likedProductId)
															setLikeStatus(true)
														}
													}
													className="p-2 hover:bg-red-100 rounded-full duration-300"
													>
														<FaHeart
															size="20"
															className={
																userLikedProduct?.find(
																	(
																		item: any
																	) =>
																		item.isLike ===
																		true
																)
																	? "text-red-600 duration-300"
																	: "text-gray-600 hover:text-red-600 duration-300"
															}
														/>
													</button>
													<button
															className="p-1 rounded-full text-gray-600 hover:text-indigo-600 duration-300 hover:bg-indigo-100"
															onClick={() =>
																dispatch(
																	addBasketItemAsync(
																		{
																			productId: item.likedProductId,
																			color: "white",
																			size: "S",
																		}
																	)
																)
															}>
															<IoIosCart size="30" />
														</button>
													{/* {!(
														item?.quantityInStock! <
														1
													) ? (
														<button
															className="p-1 rounded-full text-gray-600 hover:text-indigo-600 duration-300 hover:bg-indigo-100"
															onClick={() =>
																dispatch(
																	addBasketItemAsync(
																		{
																			productId: item.likedProductId,
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
													)} */}
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

export default LikedProduct;
