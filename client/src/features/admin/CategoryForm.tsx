import { TextField, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import { ICategory } from "../../app/interfaces/ICategory";

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

	async function handleSubmitData(data: any) {
		try {
			await agent.Admin.createCategory(data);
			cancelEdit();
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className=" mt-5 p-5">
			<Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
				Create Category
			</Typography>
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
						className="p-3 my-5 w-full c-btn bg-zinc-300 border-none text-black hover:border hover:border-zinc-300"
						onClick={cancelEdit}>
						Cancel
					</button>
					<button
						className="p-3 my-5 w-full c-btn"
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
