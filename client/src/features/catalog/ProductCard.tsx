import { IProduct } from "../../app/interfaces/IProduct";
import { useAppDispatch } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";
import { Link } from "react-router-dom";
import {IoIosCart} from "react-icons/io"

interface IProps {
	product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
	const dispatch = useAppDispatch();

	return (
		<div className="border rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 duration-300">
			<div>
				<Link to={`/catalog/${product.id}`}>
					<img
						className="h-full w-full object-contain rounded-t-xl"
						src={product.pictureUrl}
						alt={product.name}
					/>
				</Link>
				<div className="p-4">
					<Link to={`/catalog/${product.id}`}>
						<div className="text-lg font-medium">
							{product.name}
						</div>
					</Link>
					<div className="py-3">
						<h5 className="text-sm text-gray-400 cursor-pointer">
							{product.brand} /{" "}
							{product.type}
						</h5>
					</div>
					<div className="flex justify-between items-center ">
					<h5 className="text-xl font-bold">
							$
							{(
								product.price /
								100
							).toFixed(2)}
						</h5>
						<button
							className="mr-3 hover:text-indigo-600 duration-300"
							onClick={() =>
								dispatch(
									addBasketItemAsync(
										{
											productId: product.id,
										}
									)
								)
							}>
							<IoIosCart size="25"/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
