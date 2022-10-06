import { TextField, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import { ICategory } from "../../app/interfaces/ICategory";
import { useAppDispatch } from "../../app/store/configureStore";
import { setCateLoad } from "./adminSlice";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
interface Props {
	category?: ICategory;
	cancelEdit: () => void;
}

const CategoryForm: React.FC<Props> = ({ category, cancelEdit }) => {
	type FormData = {
		name: string;
	};
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<FormData>({
		mode: "all",
	});

	const dispatch = useAppDispatch();

	async function handleSubmitData(data: any) {
		try {
			await agent.Admin.createCategory(data);
			dispatch(setCateLoad());
			cancelEdit();
		} catch (error) {
			console.log(error);
		}
	}
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
							<BiCategoryAlt size={20} />
							New Category
						</h1>
					</Link>
				</div>
			<form onSubmit={handleSubmit(handleSubmitData)}>
				<TextField
					margin="normal"
					fullWidth
					label="Category Name"
					{...register("name", {
						required: "Name is required",
					})}
					error={!!errors.name}
					helperText={errors?.name?.message}
				/>
				<div className="flex justify-between items-center gap-4">
					<button
						className="bg-gray-500 border border-gray-500 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-gray-500 duration-200"
						onClick={cancelEdit}>
						Cancel
					</button>
					<button
						className="p-3 my-5 c-btn"
						disabled={!isValid}
						type="submit">
						Create
					</button>
				</div>
			</form>
		</div>
	);
};

export default CategoryForm;
