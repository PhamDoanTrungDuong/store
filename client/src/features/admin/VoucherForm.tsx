import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { FieldValues, useForm } from "react-hook-form";
import AppDropzone from "../../app/components/AppDropzone";
import AppTextInput from "../../app/components/AppTextInput";
import { useAppDispatch } from "../../app/store/configureStore";
import { setSliderLoad, setVoucherLoad } from "./adminSlice";
import Loading from "../../app/layout/Loading";
import AppSelectList from "../../app/components/AppSelectList";

interface Props {
	voucher?: any;
	cancelEdit: () => void;
}

const VoucherForm: React.FC<Props> = ({ voucher, cancelEdit }) => {
	const [loading, setLoading] = useState(false);

	const {
		control,
		reset,
		handleSubmit,
		watch,
		formState: { isDirty, isSubmitting },
	} = useForm({
		mode: "all",
		// resolver: yupResolver<any>(validationSchema)
	});

	const watchFile = watch("file", null);
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (voucher && !watchFile && !isDirty) reset(voucher);
		return () => {
			if (watchFile) URL.revokeObjectURL(watchFile.preview);
		};
	}, [voucher, reset, watchFile, isDirty]);

	var features = ["Percent", "FreeShip", "Money"];

	async function handleSubmitData(data: FieldValues) {
		// console.log(data);
		try {
			if (voucher) {
				setLoading(true);
				await agent.Admin.updateVoucher(data).then(() => {
					setLoading(false);
					dispatch(setVoucherLoad());
				});
			} else {
				setLoading(true);
				await agent.Admin.newVoucher(data).then(() => {
					setLoading(false);
					dispatch(setVoucherLoad());
				});
			}
			cancelEdit();
		} catch (error) {
			console.log(error);
		}
	}

	if (loading) return <Loading message={voucher ? "Updating voucher..." : "Creating voucher..."} />;

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
						New Voucher
					</h1>
				</Link>
			</div>
			<form onSubmit={handleSubmit(handleSubmitData)}>
				<div>
					<div className="py-4">
						<AppTextInput
							control={control}
							name="name"
							label="Name"
						/>
					</div>
					<div className="py-4">
						<AppTextInput
							control={control}
							name="code"
							label="Code"
						/>
					</div>
					<div className="py-4">
						<AppTextInput
							control={control}
							name="value"
							label="Value"
						/>
					</div>
					<div className="py-4">
						<AppSelectList items={features} control={control} name='feature' label='Feature' />
					</div>
				</div>
				<div className="flex justify-between items-center gap-4">
					<button
						className="bg-gray-500 border border-gray-500 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-gray-500 duration-200"
						onClick={cancelEdit}>
						Cancel
					</button>
					<button className="p-3 my-5 c-btn" type="submit">
						{voucher ? "Update" : "Create"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default VoucherForm;
