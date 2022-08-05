import {
	Divider,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import Loading from "../../app/layout/Loading";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelector } from "./catalogSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import CommentThread from "./CommentThread";
import agent from "../../app/api/agent";

interface Inputs {
	productId: string;
	content: string;
}

const ProductDetails: React.FC = () => {
	const { register, handleSubmit } = useForm<Inputs>();
	const { basket, status } = useAppSelector((state) => state.basket);
	const { status: productStatus } = useAppSelector((state) => state.catalog);
	const dispatch = useAppDispatch();
	const params = useParams();


	const idProduct = params.id;

	const { id } = useParams<{ id: any }>();
	const product = useAppSelector((state) => productSelector.selectById(state, id));

	const [quantity, setQuantity] = useState(0);

	const item = basket?.items.find((i) => i.productId === product?.id);

	useEffect(() => {
		if (item) setQuantity(item.quantity);
		if (!product) dispatch(fetchProductAsync(+id));
	}, [id, item, dispatch, product]);

	const hanldeInputChange = (e: any) => {
		if (+e.target.value > 0 && +e.target.value <= 10) {
			setQuantity(+e.target.value);
		}
	};

	const hanldeUpdateCart = () => {
		if (!item || quantity > item.quantity) {
			const updatedQty = item ? quantity - item.quantity : quantity;
			dispatch(
				addBasketItemAsync({
					productId: product?.id!,
					quantity: updatedQty,
				})
			);
		} else {
			const updatedQty = item.quantity - quantity;
			dispatch(
				removeBasketItemAsync({
					productId: product?.id!,
					quantity: updatedQty,
				})
			);
		}
	};

	if (productStatus.includes("pending")) return <Loading message="Loading Detail..." />;

	if (!product) return <NotFound />;

	const submitComment: SubmitHandler<Inputs> = (data: any, e: any) => {
		e.target.reset();
		data = { ...data, productId: idProduct };
		if(data){
			agent.Comment.postComment(data);
		}
	};

	return (
		<div className="rounded-div mt-5 p-5">
			<Grid container spacing={6}>
				<Grid item xs={6}>
					<img
						className="border rounded-xl"
						src={product.pictureUrl}
						alt={product.name}
						style={{ width: "100%" }}
					/>
				</Grid>
				<Grid item xs={6}>
					<h4 className="text-3xl font-bold">{product.name}</h4>
					<Divider sx={{ mb: 2 }} />
					<h4 className="text-indigo-600 font-bold text-3xl">
						${(product.price / 100).toFixed(2)}
					</h4>
					<TableContainer>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>
										{product.name}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										Description
									</TableCell>
									<TableCell>
										{
											product.description
										}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Type</TableCell>
									<TableCell>
										{product.type}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Brand</TableCell>
									<TableCell>
										{product.brand}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										Quantity
									</TableCell>
									<TableCell>
										{
											product.quantityInStock
										}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
					<Grid container spacing={3} sx={{ marginTop: "10px" }}>
						<Grid item xs={6}>
							<TextField
								variant="outlined"
								type="number"
								label="Quatity in Cart"
								fullWidth
								value={quantity}
								onChange={hanldeInputChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<LoadingButton
								disabled={
									item?.quantity ===
										quantity ||
									(!item && quantity === 0)
								}
								loading={status.includes("pending")}
								sx={{ height: "55px" }}
								color="primary"
								size="large"
								variant="contained"
								fullWidth
								onClick={hanldeUpdateCart}>
								{item
									? "Update Quantity"
									: "Add to Cart"}
							</LoadingButton>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<div>
				<h1 className="text-3xl font-bold mt-5">Comment</h1>

				<div>
					<form
						onSubmit={handleSubmit(submitComment)}
						className="w-full  bg-white rounded-xl pt-2">
						<h2 className="px-4 pt-3 pb-2 text-black text-lg font-medium">
							Add a new comment
						</h2>
						<div className="flex flex-row justify-between mx-3 mb-6">
							<div className="w-full md:w-full px-2 mb-2 mt-2">
								<input
									{...register("content")}
									className=" rounded border border-gray-300 leading-normal resize-none w-full p-5 focus:outline-none focus:bg-white"
									name="content"
									placeholder="Type Your Comment"
								/>
							</div>
							<div className="w-full md:w-full flex items-start px-3">
								<div className="mr-1">
									<button
										type="submit"
										className="bg-indigo-600 border border-indigo-600 text-white p-5 w-full rounded-2xl shadow-xl hover:shadow-2xl my-2 hover:bg-transparent hover:text-indigo-600 duration-200">
										Post Comment
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div className="my-5 w-4/6 h-[500px] overflow-y-scroll scrollbar-hide">
					<CommentThread idProduct={idProduct} />
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
