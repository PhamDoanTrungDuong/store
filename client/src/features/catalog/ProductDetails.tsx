import { Box, Rating, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync, setStateBasket } from "../basket/basketSlice";
import { fetchProductAsync, productSelector } from "./catalogSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import CommentThread from "./CommentThread";
import agent from "../../app/api/agent";
import Swal from "sweetalert2";

interface Inputs {
	productId: string;
	content: string;
}

const ProductDetails: React.FC = () => {
	const { register, handleSubmit } = useForm<Inputs>();
	const [valuesStar, setValuesStar] = useState<number | null>(0);
	const [avg, setAvg] = useState<number>(0);
	const { basket } = useAppSelector((state) => state.basket);
	const { status: productStatus } = useAppSelector((state) => state.catalog);
	const dispatch = useAppDispatch();
	const params = useParams();
	const { status } = useAppSelector((state) => state.basket);
	const [hover, setHover] = useState(-1);
	const labels: { [index: string]: string } = {
		1: 'Useless+',
		2: 'Poor+',
		3: 'Ok+',
		4: 'Good+',
		5: 'Excellent+',
	};
	function getLabelText(value: number) {
		return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
	}

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

	const idProduct = params.id;

	const { id } = useParams<{ id: any }>();
	const product = useAppSelector((state) => productSelector.selectById(state, id));

	useEffect(() => {
		if (id !== undefined)
			agent.Comment.getRatings(Number(id))
				.then((res) => setAvg(res))
				.catch((error) => console.log(error));
	}, [avg, id]);

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
		setValuesStar(0);
		data = { ...data, rate: valuesStar, productId: idProduct };
		if (data) {
			agent.Comment.postComment(data);
		}
	};

	return (
		<div className="mt-5 p-5">
			<div className="grid md:grid-cols-2 ml-4">
				<div className="relative">
					<img
						className="border rounded-xl w-[100%] md:w-[80%] object-contain"
						src={product.pictureUrl}
						alt={product.name}
					/>
					{product?.quantityInStock! < 0 ? (
							<img
								src="/images/out-of-stock-2.png"
								alt={product.name}
								className="absolute top-0 left-3 w-[15%]"
							/>
						) : (
							""
						)}
				</div>
				<div className="max-w-[400px] mt-5 md:mt-0">
					<div className="flex gap-10 items-center">
						<div className="p-2 uppercase font-bold text-black text-xs bg-[#DAD8E1] border w-fit">
							<h1>{product.type}</h1>
						</div>
						<div className="flex items-center">
							<p className="mr-2 text-lg md:text-xl text-indigo-600 font-medium underline underline-offset-4">{avg.toFixed(1)} /5</p>
							<Rating name="read-only" size="small" value={Math.ceil(avg)} readOnly />
						</div>
					</div>
					<div className="mt-8">
						<h4 className="text-3xl font-bold">
							{product.name}
						</h4>
					</div>
					<div className="mt-5 text-[#C1C4C7]">
						<h4>SKU: #{product.id}</h4>
					</div>
					<div className="mt-5 text-gray-400">
						<p>{product.description}</p>
					</div>
					<div className="my-8 flex justify-between items-center">
						<div>
							<TextField
								variant="outlined"
								type="number"
								label="Quatity in Cart"
								fullWidth
								minRows={1}
								maxRows={11}
								// InputProps={{ inputProps: { min: "1", max: "10", step: "1" } }}
								value={quantity}
								onChange={hanldeInputChange}
							/>
						</div>
						<h4 className="font-bold text-2xl md:text-3xl">
							${(product.price / 100).toFixed(2)}
						</h4>
					</div>
					<div>
						<button
							className={
								item?.quantity === quantity ||
								(!item && quantity === 0)
									? "p-4 w-full text-white bg-zinc-300 rounded-lg"
									: "p-4 w-full text-white bg-indigo-600 hover:bg-transparent hover:text-indigo-600 duration-300 border border-indigo-600 rounded-lg"
							}
							disabled={
								item?.quantity === quantity ||
								(!item && quantity === 0)
							}
							onClick={hanldeUpdateCart}>
							{item ? "Update Quantity" : "Add to Cart"}
						</button>
					</div>
				</div>
			</div>
			<div className="mt-10">
				<h1 className="text-3xl font-bold">Comment and Evaluate</h1>

				<div>
					<form
						onSubmit={handleSubmit(submitComment)}
						className="w-full bg-white rounded-xl pt-2">
						<h2 className="px-4 pt-3 pb-2 text-black text-lg font-medium">
							Add a new comment
						</h2>
						<div className="flex flex-col md:flex-row justify-between mx-3 mb-6">
							<div className="w-full md:w-full px-2 mb-2 mt-2">
								<div className="flex justify-start items-center my-2">
									<span className="mr-3 font-medium">
										Evaluate:
									</span>
									<div className="flex gap-1">
										<Rating
											name="simple-controlled"
											value={valuesStar}
											getLabelText={getLabelText}
											onChange={(
												event,
												newValue
											) => {
												setValuesStar(
													newValue
												);
											}}
											onChangeActive={(event, newHover) => {
												setHover(newHover);
											}}
										/>
										<span>
											{valuesStar !== null && (
												<Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : valuesStar]}</Box>
											)}
										</span>
									</div>
								</div>
								<div>
									<input
										{...register("content")}
										className=" rounded border border-gray-300 leading-normal resize-none w-full px-5 py-3 focus:outline-none focus:bg-white"
										name="content"
										placeholder="Type Your Comment"
									/>
								</div>
							</div>
							<div className="w-full md:w-full flex flex-row justify-end md:justify-start px-1 md:m-2 items-end">
								<div className="mr-1">
									<button
										type="submit"
										className="bg-indigo-600 border text-sm md:text-base border-indigo-600 text-white p-3 w-full rounded-lg shadow-xl hover:shadow-2xl hover:bg-transparent hover:text-indigo-600 duration-200">
										Submit
									</button>
								</div>
							</div>
						</div>
					</form>
				</div>
				<div className="my-5 w-full md:w-4/6 h-auto overflow-y-scroll scrollbar-hide">
					<CommentThread idProduct={idProduct} />
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
