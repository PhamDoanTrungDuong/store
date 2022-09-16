import React from "react";
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from "../../app/utilities/util";
import { IProductDiscount } from "../../app/interfaces/IProduct";
import useProducts from "../../app/hooks/useProducts";
import ProductSearch from "../catalog/ProductSearch";
import ProductSalesForm from "./ProductSalesForm";
import agent from "../../app/api/agent";
import Swal from "sweetalert2";
import { setProductState } from "../catalog/catalogSlice";
import { useAppDispatch } from "../../app/store/configureStore";
import { AiOutlineHome, AiOutlineTag } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const AdminSales: React.FC = () => {
	const { productDiscount } = useProducts();
	const [editMode, setEditMode] = useState(false);
	const [selectedSaleProduct, setSelectedSaleProduct] = useState<
		IProductDiscount | undefined
	>(undefined);
	const [loading, setLoading] = useState(false);
	const [target, setTarget] = useState(0);
	const dispatch = useAppDispatch();

	// const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	// const open = Boolean(anchorEl);
	// const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
	// 	setAnchorEl(event.currentTarget);
	// };
	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };

	// function handleSelectProduct(product: IProductDiscount) {
	// 	setSelectedSaleProduct(product);
	// 	setEditMode(true);
	// }

	function handleDeleteProduct(id: number) {
		setLoading(true);
		setTarget(id);
		agent.Catalog.deleteProductDiscount(id)
			.then(() => {
				dispatch(setProductState());
				Swal.fire({
					icon: "success",
					title: "Delete Successful",
					showConfirmButton: false,
					timer: 1500,
				});
			})
			.finally(() => setLoading(false));
	}

	function cancelEdit() {
		if (selectedSaleProduct) setSelectedSaleProduct(undefined);
		setEditMode(false);
	}

	if (editMode)
		return <ProductSalesForm product={selectedSaleProduct} cancelEdit={cancelEdit} />;
	return (
		<div className="mt-5 p-5 ">
			<div className="flex items-center ml-2 mb-5">
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
						Sales
					</h1>
				</Link>
			</div>
			<div className="flex justify-between items-center mb-3">
                        <div>
                              
                        </div>
				<div className="w-[60%]">
					<ProductSearch />
				</div>
				<div className="p-4">
					<button
						onClick={() => setEditMode(true)}
						className="border text-white px-6 py-1 border-indigo-600 bg-indigo-600 text-lg rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
						Create
					</button>
				</div>
			</div>
			<div className="h-[500px] overflow-y-scroll">
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left">
									Product
								</TableCell>
								<TableCell align="right">
									Price
								</TableCell>
								<TableCell align="right">
									Percent Sale
								</TableCell>
								<TableCell align="center">
									Type
								</TableCell>
								<TableCell align="center">
									Brand
								</TableCell>
								<TableCell align="center">
									Quantity
								</TableCell>
								<TableCell align="center">
									Options
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{productDiscount.map(
								(product: IProductDiscount) => (
									<TableRow
										key={
											product.productId
										}
										sx={{
											"&:last-child td, &:last-child th":
												{
													border: 0,
												},
										}}>
										<TableCell
											component="th"
											scope="row">
											{product.id}
										</TableCell>
										<TableCell align="left">
											<Box
												display="flex"
												alignItems="center">
												<img
													src={
														product.pictureUrl
													}
													alt={
														product.productName
													}
													style={{
														height: 50,
														marginRight: 20,
													}}
												/>
												<span>
													{
														product.productName
													}
												</span>
											</Box>
										</TableCell>
										<TableCell align="right">
											{currencyFormat(
												product.price
											)}
										</TableCell>
										<TableCell align="center">
											{
												product.discountValue
											}
											%
										</TableCell>
										<TableCell align="center">
											{
												product.type
											}
										</TableCell>
										<TableCell align="center">
											{
												product.brand
											}
										</TableCell>
										<TableCell align="center">
											{product.quantityInStock <
											0
												? 0
												: product.quantityInStock}
										</TableCell>
										<TableCell align="center">
											<LoadingButton
												onClick={() =>
													handleDeleteProduct(
														product.id
													)
												}
												loading={
													loading &&
													target ===
														product.id
												}
												startIcon={
													<Delete />
												}
												color="error"
											/>
										</TableCell>
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
			{/* {pagination && (
                        <Box sx={{ pt: 2, mb: 5 }}>
                              <AppPagination
                                    pagination={pagination}
                                    onPageChange={(page: number) =>
                                          dispatch(
                                                setPageNumber({
                                                      pageNumber: page,
                                                })
                                          )
                                    }
                              />
                        </Box>
                  )} */}
		</div>
	);
};

export default AdminSales;
