import { Typography, Box, Button, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../app/store/configureStore";
import { IProduct, IProductDiscount } from "../../app/interfaces/IProduct";
import axios from "axios";
import React from "react";
import agent from "../../app/api/agent";
import Swal from "sweetalert2";
import { setProductState } from "../catalog/catalogSlice";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlineTag } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
interface IProps {
	product?: IProductDiscount;
	cancelEdit: () => void;
}

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const ProductSalesForm: React.FC<IProps> = ({ product, cancelEdit }) => {
	const [salesProduct, setSalesProduct] = useState<IProduct[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<IProduct>();

	const { register, handleSubmit, reset } = useForm();

	useEffect(() => {
		axios.get("http://localhost:5000/api/Products/get-select-product").then(
			(res: any) => {
				setSalesProduct(res.data);
			}
		);
	}, []);

	const dispatch = useAppDispatch();

	const onSubmit = async (data: any) => {
		data.proudctId = selectedProduct?.id;
		await agent.Catalog.addProductDiscount(data.proudctId, data.percent).then(() => {
			setSelectedProduct(undefined);
			reset();
			dispatch(setProductState());
			cancelEdit();
			Swal.fire({
				icon: "success",
				title: "Create Discount Successful",
				showConfirmButton: false,
				timer: 1500,
			});
		});
	};

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div className="mt-24 p-5 rounded-div2">
			<div className="flex items-center ml-2 mt-4 mb-8">
				<Link to="/">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineHome size={20} />
						Home
					</h1>
				</Link>
				<div className="mx-2">
					<IoIosArrowForward size={15} />
				</div>
				<Link to="/">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineTag size={20} />
						Product Sales
					</h1>
				</Link>
			</div>
			<div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="mb-4">
						{selectedProduct !== undefined && (
							<div
								className="flex items-center cursor-pointer hover:bg-gray-200 p-3 rounded-xl duration-100"
								key={selectedProduct.id}>
								<img
									className="w-24 my-2 mr-5 rounded-lg"
									src={selectedProduct.pictureUrl}
									alt=""
								/>
								<div className="flex gap-10 text-xl">
									<p className="mr-2">
									<span className="text-base font-bold">Id: </span>#{selectedProduct.id}
									</p>
									<p><span className="text-base font-bold">Name: </span>{selectedProduct.name}</p>
									<p><span className="text-base font-bold">Price: </span> ${(selectedProduct.price).toFixed(2)}</p>
									<p><span className="text-base font-bold">Quantity: </span>{selectedProduct.quantityInStock}</p>
								</div>
							</div>
						)}
					</div>
					<div className="flex justify-between items-center gap-3">
						<div className="basis-[80%]">
							<input
								className="px-4 py-2 border border-gray-300 rounded-lg w-full"
								placeholder="Enter Discount Value (%)"
								{...register("percent", {
									required: "Percent is required",
								})}
							/>
						</div>
						<div className="basis-[20%]">
							<div
								className="c-btn cursor-pointer text-center w-full"
								onClick={handleOpen}>
								Choose Product
							</div>
							<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby="modal-modal-title"
								aria-describedby="modal-modal-description">
								<Box sx={style}>
									<div className="max-h-[500px] overflow-y-scroll">
										{salesProduct &&
											salesProduct.map(
												(
													item: IProduct
												) => {
													return (
														<div
															onClick={() => {
																handleClose();
																setSelectedProduct(
																	item
																);
															}}
															className="flex items-center cursor-pointer hover:bg-gray-200 p-3 rounded-xl duration-100"
															key={
																item.id
															}>
															<img
																className="w-16 my-2 mr-2 rounded-lg"
																src={
																	item.pictureUrl
																}
																alt=""
															/>
															<div className="flex">
																<p className="mr-2">
																	#
																	{
																		item.id
																	}
																</p>
																<p>
																	{
																		item.name
																	}
																</p>
															</div>
														</div>
													);
												}
											)}
									</div>
								</Box>
							</Modal>
						</div>
					</div>
					<Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
						<Button
							onClick={cancelEdit}
							variant="contained"
							color="inherit">
							Cancel
						</Button>
						<button className="c-btn" type="submit">
							Submit
						</button>
					</Box>
				</form>
			</div>
		</div>
	);
};

export default ProductSalesForm;
