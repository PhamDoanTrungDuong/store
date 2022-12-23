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
import { setPartnerLoad } from "./adminSlice";
import Loading from "../../app/layout/Loading";

interface Props {
	partner?: any;
	cancelEdit: () => void;
}

const PartnerForm: React.FC<Props> = ({ partner, cancelEdit }) => {
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
		if (partner && !watchFile && !isDirty) reset(partner);
		return () => {
			if (watchFile) URL.revokeObjectURL(watchFile.preview);
		};
	}, [partner, reset, watchFile, isDirty]);

	async function handleSubmitData(data: FieldValues) {
		// console.log(data);
		try {
			if (partner) {
				setLoading(true);
				await agent.Admin.updatePartner(data).then(() => {
					setLoading(false);
					dispatch(setPartnerLoad());
				});
			} else {
				setLoading(true);
				await agent.Admin.newPartner(data).then(() => {
					setLoading(false);
					dispatch(setPartnerLoad());
				});
			}
			cancelEdit();
		} catch (error) {
			console.log(error);
		}
	}

	if (loading)
		return <Loading message={partner ? "Updating partner..." : "Creating partner..."} />;

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
						New Partner
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
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center">
							<AppDropzone
								control={control}
								name="file"
							/>
							{watchFile ? (
								<img
									src={watchFile.preview}
									alt="preview"
									style={{ maxHeight: 200 }}
								/>
							) : (
								<img
									src={partner?.picture}
									alt={partner?.caption}
									style={{ maxHeight: 200 }}
								/>
							)}
						</Box>
					</div>
				</div>
				<div className="flex justify-between items-center gap-4">
					<button
						className="bg-gray-500 border border-gray-500 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-gray-500 duration-200"
						onClick={cancelEdit}>
						Cancel
					</button>
					<button className="p-3 my-5 c-btn" type="submit">
						{partner ? "Update" : "Create"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default PartnerForm;
