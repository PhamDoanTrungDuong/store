import { Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";
import agent from "../../app/api/agent";
import CategorySearch from "../../app/components/CategorySearch";
import { ICategory } from "../../app/interfaces/ICategory";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchCategories, setCateLoad } from "./adminSlice";
import CategoryForm from "./CategoryForm";
import { Link } from "react-router-dom";

const AdminCategories: React.FC = () => {
	const { categories, load } = useAppSelector((state) => state.admin);
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [target, setTarget] = useState<number | null>(null);

	const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>(undefined);

	const dispatch = useAppDispatch();

	useEffect(() => {
		!load ? dispatch(fetchCategories()) : dispatch(fetchCategories());
	}, [dispatch, load])

	function cancelEdit() {
		if (selectedCategory) setSelectedCategory(undefined);
		setEditMode(false);
	}

	const handleDeleteCategory = async (id: number) => {
		setLoading(true);
		setTarget(id);
		await agent.Admin.deleteCategory(id)
			.then(() => dispatch(setCateLoad()))
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	if (editMode) return <CategoryForm category={selectedCategory} cancelEdit={cancelEdit} />;

	return (
		<div className="mt-5 p-5">
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
						<BiCategoryAlt size={20} />
						Categories
					</h1>
				</Link>
			</div>
			<div className="flex justify-between items-center">
				<div></div>
				<div className="w-[60%]">
					<CategorySearch />
				</div>
				<div className="p-4">
					<button
						onClick={() => setEditMode(true)}
						className="border text-white px-6 py-1 border-indigo-600 bg-indigo-600 text-lg rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
						Create
					</button>
				</div>
			</div>
			<div className="h-[400px] overflow-y-scroll">
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Id</TableCell>
								<TableCell align="left">
									Category Name
								</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{categories?.map((cate: any, idx) => (
								<TableRow
									key={idx}
									sx={{
										"&:last-child td, &:last-child th":
											{
												border: 0,
											},
									}}>
									<TableCell
										component="th"
										scope="row">
										{cate.cateId}
									</TableCell>
									<TableCell align="left">
										<span>
											{cate.name}
										</span>
									</TableCell>
									<TableCell align="right">
										<LoadingButton
											onClick={() =>
												handleDeleteCategory(
													cate.cateId
												)
											}
											loading={
												loading &&
												target ===
													cate.cateId
											}
											startIcon={
												<Delete />
											}
											color="error"
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default AdminCategories;
