import { IProduct } from "../../app/interfaces/IProduct";
import { useAppDispatch } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";
import { Link } from "react-router-dom";
import { IoIosCart } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import { Rating, Tooltip } from "@mui/material";

interface IProps {
	product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
	const dispatch = useAppDispatch();
	const [avg, setAvg] = useState<number>(0);
	useEffect(() => {
		if (product.id !== undefined)
			agent.Comment.getRatings(Number(product.id))
				.then((res) => setAvg(res))
				.catch((error) => console.log(error));
		// console.log("[AvgStarRating]: ", avg);
	}, [avg, product.id]);

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
						<h5 className="text-xl font-bold">
							${(product.price / 100).toFixed(2)}
						</h5>
						<div className="flex items-center">
							<button className="mr-3">
								<FaHeart
									size="20"
									className="text-gray-600 hover:text-red-600 duration-300"
								/>
							</button>
							{!(product?.quantityInStock! < 1) ? (
								<button
									className="p-2 rounded-full text-gray-600 hover:text-indigo-600 duration-300 hover:bg-indigo-100"
									onClick={() =>
										dispatch(
											addBasketItemAsync(
												{
													productId: product.id,
													color: "white",
													size: "S"
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
};

export default ProductCard;
