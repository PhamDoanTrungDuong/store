import React, { useEffect } from "react";
import {
	Box,
} from "@mui/material";
import { useState } from "react";
import { currencyFormat } from "../../app/utilities/util";
import { IProductDiscount } from "../../app/interfaces/IProduct";
import useProducts from "../../app/hooks/useProducts";
import ProductSearch from "../catalog/ProductSearch";
import ProductSalesForm from "./ProductSalesForm";
import agent from "../../app/api/agent";
import Swal from "sweetalert2";
import { fetchProductsDiscountAsync, setProductState } from "../catalog/catalogSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { AiOutlineHome, AiOutlineTag, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";


const AdminSales: React.FC = () => {
	const { productsLoaded, productDiscount } = useAppSelector((state) => state.catalog);
	const [editMode, setEditMode] = useState(false);
	const [selectedSaleProduct, setSelectedSaleProduct] = useState<
		IProductDiscount | undefined
	>(undefined);
	const [loading, setLoading] = useState(false);
	const [target, setTarget] = useState(0);

	const dispatch = useAppDispatch(); 
	useEffect(() => {
		!productsLoaded ? dispatch(fetchProductsDiscountAsync()) : dispatch(fetchProductsDiscountAsync());
	 }, [dispatch, productsLoaded]);


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

	function handleDeleteProductSale(id: number) {
		let response = agent.Catalog.deleteProductDiscount(id)
			.then(() => {
				dispatch(setProductState());
			})
		return response
	}

	const handleDeleteSale = (id: number) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		 }).then((result) => {
			if (result.isConfirmed) {
				handleDeleteProductSale(id).then(() => {
					Swal.fire(
					  'Deleted!',
					  'Product sale has been deleted.',
					  'success'
					)
				})
			}
		 })
	}

	function cancelEdit() {
		if (selectedSaleProduct) setSelectedSaleProduct(undefined);
		setEditMode(false);
	}

	if (editMode)
		return <ProductSalesForm product={selectedSaleProduct} cancelEdit={cancelEdit} />;
	return (
		<div className="mt-24 p-5 ">
			<div className="flex justify-between items-center mb-8">
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
				<div>
						<button
							onClick={() => setEditMode(true)}
							className="flex justify-between items-center gap-2 border text-white px-3 py-2 border-indigo-600 bg-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
							<AiOutlinePlus />
							New Sale Product
						</button>
				</div>
			</div>
			<div className="rounded-div2 p-0">
				<div className="flex p-6 justify-between items-center mb-3">
					<div className="w-full">
						<ProductSearch />
					</div>
					<div></div>
				</div>
				<div className="h-[500px] overflow-y-scroll">
						<table className="table-auto w-full text-xs sm:text-sm md:text-base">
							<thead>
								<tr className="border-b border-gray-200">
									<td className="px-4 py-3" align="center">#</td>
									<td className="px-4 py-3" align="left">
										Product
									</td>
									<td className="px-4 py-3" align="center">
										Price
									</td>
									<td className="px-4 py-3" align="center">
										Percent Sale
									</td>
									<td className="px-4 py-3" align="center">
										Type
									</td>
									<td className="px-4 py-3" align="center">
										Brand
									</td>
									<td className="px-4 py-3" align="center">
										Quantity
									</td>
									<td className="px-4 py-3" align="center">
										Options
									</td>
								</tr>
							</thead>
							<tbody>
								{productDiscount.map(
									(product: IProductDiscount) => (
										<tr
											className="border-b border-gray-200"
											key={
												product.productId
											}>
											<td className="py-7" align="center">
												{product.id}
											</td>
											<td align="left">
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
											</td>
											<td align="center">
												{currencyFormat(
													product.price
												)}
											</td>
											<td align="center">
												{
													product.discountValue
												}
												%
											</td>
											<td align="center">
												{
													product.type
												}
											</td>
											<td align="center">
												{
													product.brand
												}
											</td>
											<td align="center">
												{product.quantityInStock <
												0
													? 0
													: product.quantityInStock}
											</td>
											<td align="center" className="flex justify-center items-center gap-2 mt-[20%]">
												<div
												className="p-2 hover:bg-red-300/30 rounded-full duration-200 cursor-pointer"
													onClick={() =>
														handleDeleteSale(
															product.id
														)
													}
												>
													<FiTrash2 size={20} className='text-red-600' />
												</div>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
				</div>
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
