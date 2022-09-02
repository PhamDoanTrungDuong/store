import { TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import agent from '../../app/api/agent';
import Swal from 'sweetalert2';
import { changePwd, setStateUser } from './accountSlice';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';

const ChangePassword: React.FC = () => {
      const dispatch = useAppDispatch();
	const { status } = useAppSelector((state) => state.account);

      type FormData = {
		currentPassword: string;
		newPassword: string;
		confirmNewPassword: string;
	};
	const {
		register,
		handleSubmit,
		setError,
            reset,
		formState: { errors, isValid },
	} = useForm<FormData>({
		mode: "all",
	});

      const handleApiErrors = (errors: any) => {
            console.log(errors)
            // if(errors){
            //       errors.forEach((error: string) => {
            //             console.log(error)
            //       })
            // }
		if (errors) {
			errors.forEach((error: string) => {
				if (error.includes("Incorrect password.")) {
					setError("currentPassword", {
						message: error,
					});
				}
                        // else if (error.includes("Email")) {
				// 	setError("email", { message: error });
				// } else if (error.includes("Username")) {
				// 	setError("username", {
				// 		message: error,
				// 	});
				// }
			});
		}
	};

      useEffect(() => {
		if (status === "changePwdSuccess") {
			Swal.fire({
				icon: "success",
				title: "Your password has been change",
				showConfirmButton: false,
				timer: 1500,
			});
		}

		return () => {
			dispatch(setStateUser());
		};
	}, [dispatch, status]);

  return (
      <div className="mt-5">
			<div className="max-w-[350px] md:max-w-[400px] border h-auto border-slate-300 rounded-2xl px-4 py-10 my-[100px] mx-auto">
				<div className="p-4 flex flex-col items-center">
					<h1 className="font-bold text-2xl">
						Change Password
					</h1>
					<form
						onSubmit={handleSubmit((data) =>
							agent.Account.changePwd(
								data
							)
								.then(() => {
									dispatch(changePwd())
                                                      reset()
								})
								.catch(
									(
										error
									) =>
										handleApiErrors(
											error
										)
								)
						)}
                                    >
						<TextField
							margin="normal"
							fullWidth
							type="password"
							label="Current Password"
							{...register(
								"currentPassword",
								{
									required: "Current Password is required",
								}
							)}
							error={
								!!errors.currentPassword
							}
							helperText={
								errors?.currentPassword
									?.message
							}
						/>
						<TextField
							margin="normal"
							fullWidth
							type="password"
							label="New Password"
							{...register("newPassword", {
								required: "New Password is required",
                                                pattern: {
                                                      value: /(?=^.{6,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                                                      message: "Password is not complex enough",
                                                },
							})}
							error={!!errors.newPassword}
							helperText={
								errors?.newPassword
									?.message!
							}
						/>
						<TextField
							margin="normal"
							fullWidth
							label="Confirm NewPassword"
							type="password"
							{...register(
								"confirmNewPassword",
								{
									required: "Confirm NewPassword is required",
									pattern: {
										value: /(?=^.{6,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
										message: "Password is not complex enough",
									},
								}
							)}
							error={
								!!errors.confirmNewPassword
							}
							helperText={
								errors?.confirmNewPassword
									?.message
							}
						/>
						<button
							className={!isValid ? "p-3 my-5 w-full bg-slate-400 rounded-lg" : "p-3 my-5 w-full c-btn"}
							disabled={!isValid}
							type="submit">
							Submit
						</button>
					</form>
				</div>
			</div>
		</div>
  )
}

export default ChangePassword