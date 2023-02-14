import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { useAppDispatch } from "../../app/store/configureStore";
import { setColorsLoad } from "./adminSlice";
import Loading from "../../app/layout/Loading";

interface Props {
	color?: any;
	cancelEdit: () => void;
}

const ColorForm: React.FC<Props> = ({ color, cancelEdit }) => {
	console.log(color)
	const [loading, setLoading] = useState(false);

	const {
		control,
		reset,
		handleSubmit,
		formState: { isDirty },
	} = useForm({
		mode: "all",
		// resolver: yupResolver<any>(validationSchema)
	});

	const dispatch = useAppDispatch();
	useEffect(() => {
		if (color  && !isDirty) reset(color);
	}, [color, reset, isDirty]);

	async function handleSubmitData(data: FieldValues) {
		console.log(data);
		try {
			if (color) {
				setLoading(true);
				await agent.Admin.updateColor(data).then(() => {
					setLoading(false);
					dispatch(setColorsLoad());
				});
			} else {
				setLoading(true);
				await agent.Admin.createColor(data).then(() => {
					setLoading(false);
					dispatch(setColorsLoad());
				});
			}
			cancelEdit();
		} catch (error) {
			console.log(error);
		}
	}

	if (loading) return <Loading message={color ? "Updating color..." : "Creating color..."} />;

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
						New Color
					</h1>
				</Link>
			</div>
			<form onSubmit={handleSubmit(handleSubmitData)}>
				<div>
					<div className="py-4">
						<AppTextInput
							control={control}
							name="colour_value"
							label="Name"
						/>
					</div>
					<div className="py-4">
						<AppTextInput
							control={control}
							name="colour_code"
							label="Code"
						/>
					</div>
				</div>
				<div className="flex justify-between items-center gap-4">
					<button
						className="bg-gray-500 border border-gray-500 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-gray-500 duration-200"
						onClick={cancelEdit}>
						Cancel
					</button>
					<button className="p-3 my-5 c-btn" type="submit">
						{color ? "Update" : "Create"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default ColorForm;
