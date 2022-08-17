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
import agent from "../../app/api/agent";
import { ICategory } from "../../app/interfaces/ICategory";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchCategories } from "./adminSlice";
import CategoryForm from "./CategoryForm";

const AdminCategories: React.FC = () => {
	const { categories } = useAppSelector((state) => state.admin);
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [target, setTarget] = useState<number | null>(null);

	const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>(undefined);

	const dispatch = useAppDispatch();
	useEffect(() => {
		 dispatch(fetchCategories())
	}, [dispatch]);

	function cancelEdit() {
		if (selectedCategory) setSelectedCategory(undefined);
		setEditMode(false);
	}

	const handleDeleteCategory = async (id: number) => {
		setLoading(true);
		setTarget(id);
		await agent.Admin.deleteCategory(id)
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	if (editMode) return <CategoryForm category={selectedCategory} cancelEdit={cancelEdit} />;


	return (
		<div className="mt-5 p-5">
			<div className="flex justify-between">
				<h4 className="text-2xl font-bold my-4">Category</h4>
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
