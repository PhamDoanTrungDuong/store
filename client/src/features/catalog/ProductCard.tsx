import { IProduct, IProductDiscount } from "../../app/interfaces/IProduct";
import { useAppDispatch } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";
import { Link } from "react-router-dom";
import { IoIosCart } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import { Rating, Tooltip } from "@mui/material";
import useProducts from "../../app/hooks/useProducts";

interface IProps {
	product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
	const { productDiscount } = useProducts();

	const [productSales, setProductSales] = useState<IProductDiscount>();
	const [currentLike, setCurrentLike] = useState<any>();
	const [likeStatus, setLikeStatus] = useState<boolean>();

	const dispatch = useAppDispatch();
	const [avg, setAvg] = useState<number>(0);
	useEffect(() => {
		if (product.id !== undefined)
			agent.Comment.getRatings(Number(product.id))
				.then((res) => setAvg(res))
				.catch((error) => console.log(error));
	}, [avg, product.id]);

	useEffect(() => {
		if(product !== null){
			agent.Like.getCurrentLike().then((res: any) => {
					setCurrentLike(res);
				}).finally(() => {
				  setLikeStatus(false);
			  })
		}
	}, [product, likeStatus]);

	useEffect(() => {
		productDiscount.filter((e: any) => {
			if (product.id && e.productId === product.id) {
				setProductSales(e);
			}
			return product.id;
		});
	}, [productDiscount, product.id]);

	const handleLike = async (productId: number) => {
		await agent.Like.addLike(productId);
	};

	return (
		<div className="border rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 duration-300">
			<div>
				<Link to={`/catalog/${product.id}`}>
					<div className="relative">
						<img
							className="h-full w-full object-contain rounded-t-xl"
							src={product.pictureUrl}
							alt={product.name}
						/>
						{product?.quantityInStock! < 0 ? (
							<img
								src="./images/out-of-stock-2.png"
								alt={product.name}
								className="absolute top-0 left-3 w-[22%]"
							/>
						) : (
							""
						)}
						{productSales?.discountValue ? (
							<>
								<img
									src="./images/discount.png"
									alt={
										productSales.productName
									}
									className="absolute top-[-1px] right-3 w-[30%]"
								/>
								<p className="text-white rotate-6 font-bold text-xl absolute top-[26px] right-[50px] z-10">
									{
										productSales?.discountValue
									}
								</p>
							</>
						) : (
							""
						)}
					</div>
				</Link>
				<div className="p-4">
					<Link to={`/catalog/${product.id}`}>
						<div className="text-lg font-medium">
							{product.name}
						</div>
					</Link>
					<div className="py-3">
						<h5 className="text-sm text-gray-400 cursor-pointer">
							{product.brand} / {product.type}
						</h5>
					</div>
					<div className="flex items-center my-1">
						<Rating
							name="read-only"
							size="small"
							value={Math.ceil(avg)}
							readOnly
						/>
						<p className="text-sm ml-2 text-gray-500">
							({avg})5
						</p>
					</div>
					<div className="flex justify-between items-center">
						{productSales?.discountValue ? (
							<>
								<div className="flex gap-2 text-lg font-bold">
									<h5 className="text-gray-400 font-bold line-through">
										$
										{(
											product.price /
											100
										).toFixed(2)}
									</h5>
									<h5 className="font-bold">
										$
										{(
											productSales.price /
												100 -
											(productSales.price *
												(productSales.discountValue /
													100)) /
												100
										).toFixed(2)}
									</h5>
								</div>
							</>
						) : (
							<h5 className="text-lg font-bold">
								${(product.price / 100).toFixed(2)}
							</h5>
						)}
						<div className="flex items-center">
							<button
								onClick={() => {
										// handleLike(product.id)
										// setLikeStatus(true)
									}
								}
								className="p-2 hover:bg-red-100 rounded-full duration-300">
								<FaHeart
									size="20"
									className={
										currentLike?.find(
											(
												item: any
											) =>
												item.likedProductId ===
													product.id &&
												item.isLike ===
													true
										)
											? "text-red-600 duration-300"
											: "text-gray-600 hover:text-red-600 duration-300"
									}
								/>
							</button>
							{!(product?.quantityInStock! < 1) ? (
								<button
									className="p-1 rounded-full text-gray-600 hover:text-indigo-600 duration-300 hover:bg-indigo-100"
									onClick={() =>
										dispatch(
											addBasketItemAsync(
												{
													productId: product.id,
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
									<button className="p-1 cursor-default text-gray-600">
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
};

export default ProductCard;
