import { LoadingButton } from "@mui/lab";
import { Grid, Box } from "@mui/material";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import agent from "../../app/api/agent";
import AppTextInput from "../../app/components/AppTextInput";

interface IProps {
	address?: any;
	cancelEdit: () => void;
}

const ShippingAddressForm: React.FC<IProps> = ({ address, cancelEdit }) => {
	const {
		control,
		reset,
		handleSubmit,
		formState: { isDirty, isSubmitting },
	} = useForm({
		mode: "all",
	});

  useEffect(() => {
    if (address && !isDirty) reset(address);
}, [address, reset, isDirty]);

	async function handleSubmitData(data: FieldValues) {
		try {
      if(address){
        await agent.Account.updateAddress(data).then(() => {
          Swal.fire({
            icon: "success",
            title: "Update Address Successful",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }else{
        await agent.Account.newAddress(data).then(() => {
          Swal.fire({
            icon: "success",
            title: "Create Address Successful",
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
			cancelEdit();
		} catch (error) {
			console.log(error);
		}
	}

	const deleteCurrentAddress = (id: number) => {
		agent.Account.deleteAddress(id).then(() => {
			Swal.fire({
			  icon: "success",
			  title: "Delete Address Successful",
			  showConfirmButton: false,
			  timer: 1500,
			});
		 });;
	}

	return (
		<div className="my-5 p-5">
			<form onSubmit={handleSubmit(handleSubmitData)}>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={12}>
						<AppTextInput
							control={control}
							name="fullName"
							label="Full Name"
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<AppTextInput
							control={control}
							name="address1"
							label="Address 1"
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<AppTextInput
							control={control}
							name="address2"
							label="Address 2"
						/>
					</Grid>
					<Grid item xs={12} sm={12}>
						<AppTextInput
							control={control}
							name="city"
							label="City"
						/>
					</Grid>
          <Grid item xs={12} sm={12}>
						<AppTextInput
							control={control}
							name="state"
							label="State"
						/>
					</Grid>
          <Grid item xs={12} sm={12}>
						<AppTextInput
							control={control}
							name="zip"
							label="Zip"
						/>
					</Grid>
          <Grid item xs={12} sm={12}>
						<AppTextInput
							control={control}
							name="country"
							label="Country"
						/>
					</Grid>
				</Grid>

				<Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
					<div className="flex">
						<button onClick={cancelEdit} className="c-btn mr-3">
							Cancel
						</button>
						{address === undefined ? "" : (address && address.id === 0 ? "" : (
							<div onClick={() => {
									deleteCurrentAddress(address.id)
									cancelEdit()
								}} className="bg-red-600 border border-red-600 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-red-600 duration-200 cursor-pointer">
							Delete
						</div>
						))}
					</div>
					<LoadingButton
						loading={isSubmitting}
						type="submit"
						variant="contained"
						color="success">
						Submit
					</LoadingButton>
				</Box>
			</form>
		</div>
	);
};

export default ShippingAddressForm;
