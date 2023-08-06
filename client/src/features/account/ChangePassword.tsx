import { TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import Swal from "sweetalert2";
import { changePwd, setStateUser } from "./accountSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useTranslation } from "react-i18next";

const ChangePassword: React.FC = () => {
	const { t } = useTranslation();

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
		console.log(errors);
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
				title: t('Sw_PwdChange') as string,
				showConfirmButton: false,
				timer: 1500,
			});
		}

		return () => {
			dispatch(setStateUser());
		};
	}, [dispatch, status, t]);

	const curpassreq = t('Pwd_CurPassReq');
	const newpassreq = t('Pwd_NewPassReq');
	const conpassreq = t('Pwd_ConPassReq');
	const passcomplex = t('Pwd_PassComplex');

	return (
		<div className="mt-5">
			<div className="max-w-[350px] md:max-w-[400px] border h-auto border-slate-300 rounded-2xl px-4 py-10 my-[100px] mx-auto">
				<div className="p-4 flex flex-col items-center">
					<h1 className="font-bold text-2xl">{t("Pwd_Change")}</h1>
					<form
						onSubmit={handleSubmit((data) =>
							agent.Account.changePwd(data)
								.then(() => {
									dispatch(changePwd());
									reset();
								})
								.catch((error) =>
									handleApiErrors(error)
								)
						)}>
						<TextField
							margin="normal"
							fullWidth
							type="password"
							label={t("Pwd_Current")}
							{...register("currentPassword", {
								required: curpassreq,
							})}
							error={!!errors.currentPassword}
							helperText={
								errors?.currentPassword?.message
							}
						/>
						<TextField
							margin="normal"
							fullWidth
							type="password"
							label={t("Pwd_New")}
							{...register("newPassword", {
								required: newpassreq,
								pattern: {
									value: /(?=^.{6,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
									message: passcomplex,
								},
							})}
							error={!!errors.newPassword}
							helperText={errors?.newPassword?.message!}
						/>
						<TextField
							margin="normal"
							fullWidth
							label={t("Pwd_Confiem")}
							type="password"
							{...register("confirmNewPassword", {
								required: conpassreq,
								pattern: {
									value: /(?=^.{6,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
									message: passcomplex,
								},
							})}
							error={!!errors.confirmNewPassword}
							helperText={
								errors?.confirmNewPassword?.message
							}
						/>
						<button
							className={
								!isValid
									? "p-3 my-5 w-full bg-slate-400 rounded-lg"
									: "p-3 my-5 w-full c-btn"
							}
							disabled={!isValid}
							type="submit">
							{t("Ship_Submit")}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ChangePassword;
