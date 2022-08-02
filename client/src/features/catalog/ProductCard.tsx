import { LoadingButton } from "@mui/lab";
import {
	Button,
	Card,
	CardContent,
	CardMedia,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { IProduct } from "../../app/interfaces/IProduct";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";
import { Link } from "react-router-dom";

interface IProps {
	product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
	const { status } = useAppSelector((state) => state.basket);
	const dispatch = useAppDispatch();

	return (
		<div className="hover:shadow-2xl hover:scale-105 duration-300">
			<Card>
				<Link to={`/catalog/${product.id}`}>
					<CardMedia
						sx={{
							backgroundSize:
								"contain",
						}}
						className="h-[300px]"
						image={product.pictureUrl}
						title={product.name}
					/>
				</Link>
				<CardContent>
					<Link to={`/catalog/${product.id}`}>
						<div className="text-lg font-medium">
							{product.name}
						</div>
					</Link>
					<div className="flex justify-between items-center px-1 py-4">
						<h5 className="text-indigo-600 text-xl font-bold">
							$
							{(
								product.price /
								100
							).toFixed(2)}
						</h5>
						<h5 className="text-sm text-gray-400">
							{product.brand} /{" "}
							{product.type}
						</h5>
					</div>
					<div className="flex">
						<LoadingButton
							loading={status.includes(
								"pendingAddItem" +
									product.id
							)}
							onClick={() =>
								dispatch(
									addBasketItemAsync(
										{
											productId: product.id,
										}
									)
								)
							}
							size="small">
							ADD TO CARD
						</LoadingButton>
						<div className="ml-3">
            <Button
							component={NavLink}
							to={`/catalog/${product.id}`}
							size="small">
							VIEW MORE
						</Button>
            </div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProductCard;
