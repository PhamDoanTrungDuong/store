import {
	Button,
	Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppPagination from "../../app/components/AppPagination";
import { useAppDispatch } from "../../app/store/configureStore";
import { removeProduct, setPageNumber } from "../catalog/catalogSlice";
import { useState } from "react";
import ProductForm from "./ProductForm";
import agent from "../../app/api/agent";
import { currencyFormat } from "../../app/utilities/util";
import { IProduct } from "../../app/interfaces/IProduct";
import useProducts from "../../app/hooks/useProducts";
import ProductSearch from "../catalog/ProductSearch";
import { HiDotsVertical } from "react-icons/hi";
import { FiTrash2, FiEdit3 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { RiBarChartBoxFill } from "react-icons/ri";
import Swal from "sweetalert2";
import Loading from "../../app/layout/Loading";
import Tooltip from "@mui/material/Tooltip";
import Zoom from '@mui/material/Zoom';

const Inventory: React.FC = () => {
	const { products, pagination } = useProducts();
	const dispatch = useAppDispatch();
	const [editMode, setEditMode] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined);
	// const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	// const open = Boolean(anchorEl);
	// const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
	// 	setAnchorEl(event.currentTarget);
	// };
	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };

	function handleSelectProduct(product: IProduct) {
		setSelectedProduct(product);
		setEditMode(true);
	}

	function handleDeleteProduct(id: number) {
		let response = agent.Admin.deleteProduct(id)
				.then(() => dispatch(removeProduct(id)))
				.catch((error: any) => console.log(error))
		return response;
	}

	function cancelEdit() {
		if (selectedProduct) setSelectedProduct(undefined);
		setEditMode(false);
	}

	const handleDelete = (id: number) => {
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
				handleDeleteProduct(id).then(() => {
					Swal.fire(
					  'Deleted!',
					  'Product has been deleted.',
					  'success'
					)
				})
			}
		 })
	}

	if (editMode) return <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />;

	if(!products) return <Loading message="Loading products" />;
	return (
		<div className="mt-24 p-5 ">
			<div className='flex justify-between items-center mb-8'>
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
							<RiBarChartBoxFill size={20} />
							Inventory
						</h1>
					</Link>
				</div>
				<div>
					<button
						onClick={() => setEditMode(true)}
						className="flex justify-between items-center gap-2 border text-white px-3 py-2 border-indigo-600 bg-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
						<AiOutlinePlus />
						New Product
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
					<table className="table-auto w-full text-xs sm:text-sm md:text-base">
						<thead>
							<tr className="border-b border-gray-200">
								<td className="px-4 py-3" align="center">#</td>
								<td className="px-4 py-3" align="left">Product</td>
								<td className="px-4 py-3" align="right">Price</td>
								<td className="px-4 py-3" align="center">Type</td>
								<td className="px-4 py-3" align="center">Brand</td>
								<td className="px-4 py-3" align="center">
									Quantity
								</td>
								<td className="px-4 py-3" align="center">
									Options
								</td>
							</tr>
						</thead>
						<tbody>
							{products.map((product: any) => (
								<tr
									className="border-b border-gray-200"
									key={product.id}>
									<td className="py-7" align="center">
										{product.id}
									</td>
									<td>
										<Box
											display="flex"
											alignItems="center">
											<img
												src={
													product.pictureUrl
												}
												alt={
													product.name
												}
												style={{
													height: 50,
													marginRight: 20,
												}}
											/>
											<span>
												{
													product.name
												}
											</span>
										</Box>
									</td>
									<td align="right">
										{currencyFormat(
											product.price
										)}
									</td>
									<td align="center">
										{product.type}
									</td>
									<td align="center">
										{product.brand}
									</td>
									<td align="center">
										{product.quantityInStock < 0
											? 0
											: product.quantityInStock}
									</td>
									<td className="flex justify-center items-center gap-2 mt-[20%]">
										<div
											className="p-2 hover:bg-yellow-200/30 rounded-full duration-200 cursor-pointer"
											onClick={() =>
												handleSelectProduct(
													product
												)
											}>
												<Tooltip TransitionComponent={Zoom} title="Edit">
													<FiEdit3 size={20} className="text-yellow-500" />
												</Tooltip>
										</div>
										<div
											className="p-2 hover:bg-red-300/30 rounded-full duration-200 cursor-pointer"
											onClick={() =>
												handleDelete(product.id)
											}>
												<Tooltip TransitionComponent={Zoom} title="Delete">
													<FiTrash2 size={20} className='text-red-600' />
												</Tooltip>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				{pagination && (
					<Box sx={{ pt: 2, mb: 5, ml: 3 }}>
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
				)}
			</div>

		</div>
	);
};

export default Inventory;
