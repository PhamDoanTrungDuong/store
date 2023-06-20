import * as React from "react";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import AppCheckbox from "../../app/components/AppCheckbox";
import { useState } from "react";
import agent from "../../app/api/agent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 800,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
interface IProps {
	addresses: any;
	selectedAddress: any;
	handleSelected: (address: any) => void;
}
const AddressForm: React.FC<IProps> = (props) => {
	const { t } = useTranslation();

	const { control, formState } = useFormContext();
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<div>
				<div>
					<Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description">
						<Box sx={style}>
							<Typography
								id="modal-modal-title"
								variant="h6"
								component="h2">
								Choose Address
							</Typography>
							<div className="max-h-[400px] overflow-y-scroll">
								{props.addresses.map(
									(item: any) => {
										return (
											<div
												key={
													item.id
												}
												onClick={() => {
													props.handleSelected(
														item
													);
													handleClose();
												}}
												className={`flex flex-col  gap-3 my-3 p-4 border rounded-xl hover:border-gray-600 duration-100 cursor-pointer ${
													props.selectedAddress &&
													(props
														.selectedAddress
														.id ===
													item.id
														? "border-slate-800"
														: "border-gray-300")
												} `}>
												<p>
													<span className="text-lg font-bold">
														FullName
													</span>

													:{" "}
													{
														item.fullName
													}
												</p>
												<p>
													<span className="text-lg font-bold">
														Phone Number
													</span>

													:{" "}
													{
														item.phoneNumber
													}
												</p>
												<p>
													<span className="text-lg font-bold">
														Address
														1
													</span>

													:{" "}
													{
														item.address1
													}
												</p>
												<p>
													<span className="text-lg font-bold">
														Address
														2
													</span>

													:{" "}
													{
														item.address2
													}
												</p>
											</div>
										);
									}
								)}
							</div>
						</Box>
					</Modal>
				</div>
			</div>
			<div className="flex justify-between items-center cursor-pointer">
				<div></div>
				<div className="c-btn" onClick={handleOpen}>
					{t('Check_ChooseAddr')}
				</div>
			</div>
			<h6 className="text-xl font-medium my-2">{t('Check_NewShipAddre')}</h6>
			<div>
				<div className="py-4">
					<AppTextInput
						control={control}
						name="fullName"
						label={t('Check_Fullname')}
					/>
				</div>
				<div className="py-4">
					<AppTextInput
						control={control}
						name="phoneNumber"
						label={t('Check_Phone')}
					/>
				</div>
				<div className="py-4">
					<AppTextInput
						control={control}
						name="address1"
						label={t('Check_Addr1')}
					/>
				</div>
				<div className="py-4">
					<AppTextInput
						control={control}
						name="address2"
						label={t('Check_Addr2')}
					/>
				</div>
				<div className="grid grid-cols-2 py-4">
					<div className="pr-2">
						<AppTextInput
							control={control}
							name="city"
							label={t('Check_City')}
						/>
					</div>
					<div className="pl-2">
						<AppTextInput
							control={control}
							name="state"
							label={t('Check_State')}
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 py-4">
					<div className="pr-2">
						<AppTextInput
							control={control}
							name="zip"
							label="Zip"
						/>
					</div>
					<div className="pl-2">
						<AppTextInput
							control={control}
							name="country"
							label={t('Check_Country')}
						/>
					</div>
				</div>
				<div>
					<AppCheckbox
						name="saveAddress"
						label={t('Check_Save')}
						control={control}
						disabled={!formState.isDirty}
					/>
				</div>
			</div>
		</>
	);
};

export default AddressForm;
