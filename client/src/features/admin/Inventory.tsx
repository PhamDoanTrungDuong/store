import {
	Button,
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Box,
	Menu,
	MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppPagination from "../../app/components/AppPagination";
import { useAppDispatch } from "../../app/store/configureStore";
import { removeProduct, setPageNumber } from "../catalog/catalogSlice";
import { useState } from "react";
import ProductForm from "./ProductForm";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import { currencyFormat } from "../../app/utilities/util";
import { IProduct } from "../../app/interfaces/IProduct";
import useProducts from "../../app/hooks/useProducts";
import ProductSearch from "../catalog/ProductSearch";
import { HiDotsVertical } from "react-icons/hi"
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { RiBarChartBoxFill } from "react-icons/ri";

const Inventory: React.FC = () => {
	const { products, pagination } = useProducts();
	const dispatch = useAppDispatch();
	const [editMode, setEditMode] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const [target, setTarget] = useState(0);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	function handleSelectProduct(product: IProduct) {
		setSelectedProduct(product);
		setEditMode(true);
	}

	function handleDeleteProduct(id: number) {
		setLoading(true);
		setTarget(id);
		agent.Admin.deleteProduct(id)
			.then(() => dispatch(removeProduct(id)))
			.catch((error: any) => console.log(error))
			.finally(() => setLoading(false));
	}

	function cancelEdit() {
		if (selectedProduct) setSelectedProduct(undefined);
		setEditMode(false);
	}

	if (editMode) return <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />;
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
						<RiBarChartBoxFill size={20} />
						Orders
					</h1>
				</Link>
			</div>
			<div className="flex justify-between items-center mb-3">
				<div></div>
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
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell align="left">Product</TableCell>
							<TableCell align="right">Price</TableCell>
							<TableCell align="center">Type</TableCell>
							<TableCell align="center">Brand</TableCell>
							<TableCell align="center">
								Quantity
							</TableCell>
							<TableCell align="center">Options</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{products.map((product: any) => (
							<TableRow
								key={product.id}
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
								</TableCell>
								<TableCell align="right">
									{currencyFormat(
										product.price
									)}
								</TableCell>
								<TableCell align="center">
									{product.type}
								</TableCell>
								<TableCell align="center">
									{product.brand}
								</TableCell>
								<TableCell align="center">
									{product.quantityInStock < 0 ? 0 : product.quantityInStock }
								</TableCell>
								<TableCell align="center">
									<div>
										<Button
											id="basic-button"
											aria-controls={
												open
													? "basic-menu"
													: undefined
											}
											aria-haspopup="true"
											aria-expanded={
												open
													? "true"
													: undefined
											}
											onClick={
												handleClick
											}>
											<HiDotsVertical size={20} />
										</Button>
										<Menu
											id="basic-menu"
											anchorEl={
												anchorEl
											}
											open={open}
											onClose={
												handleClose
											}
											MenuListProps={{
												"aria-labelledby":
													"basic-button",
											}}>
											<MenuItem
												onClick={
													handleClose
												}>
												<Button
													onClick={() =>
														handleSelectProduct(
															product
														)
													}
													startIcon={
														<Edit />
													}
													>Edit</Button>
											</MenuItem>
											<MenuItem
												onClick={
													handleClose
												}>
												<LoadingButton
													loading={
														loading &&
														target ===
															product.id
													}
													startIcon={
														<Delete />
													}
													color="error"
													onClick={() =>
														handleDeleteProduct(
															product.id
														)
													}
												>Delete</LoadingButton>
											</MenuItem>
										</Menu>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{pagination && (
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
			)}
		</div>
	);
};

export default Inventory;
