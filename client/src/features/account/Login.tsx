import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { TbFaceId } from "react-icons/tb";
import { FieldValues, useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { googleSignIn, membersSelector, signInUser } from "./accountSlice";
import { history } from "../..";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { auth } from "../../app/firebase/firebase";
import agent from "../../app/api/agent";
import useMembers from "../../app/hooks/useMembers";
import useFaceAuthen from "../../app/hooks/useFaceAuthen";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Login = () => {
	const { t } = useTranslation();
	const { faceRegistration, faceSignIn, dataFaceRegister, dataFaceLogin, dataUserLogin } =
		useFaceAuthen();

	type FormData = {
		password: string;
		username: string;
	};

	type LocationProps = {
		state: {
			from: Location;
		};
	};
	// const members = useAppSelector(membersSelector.selectAll);

	const { members } = useMembers();

	const [googleUser, setGoogleUser] = useState<any>();
	const dispatch = useAppDispatch();

	const location = useLocation() as unknown as LocationProps;

	const from = location.state?.from?.pathname.toString() || "/";

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<FormData>({
		mode: "all",
	});
	const submitForm = async (data: FieldValues) => {
		try {
			await dispatch(signInUser(data));
			history.push(from);
		} catch (error) {
			console.log(error);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			await googleSignIn();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const unsubcribe = onAuthStateChanged(auth, (currentUser: any) => {
			setGoogleUser(currentUser);
		});

		return () => {
			unsubcribe();
		};
	}, []);
	// GOOGLE LOGIN
	useEffect(() => {
		if (googleUser) {
			const dataRegister = {
				email: googleUser.email,
				password: googleUser.uid,
				username: googleUser.email,
			};
			const dataLogin = { password: googleUser.uid, username: googleUser.email };

			let userLogin = members.find((item) => item.email === googleUser.email);
			if (userLogin === undefined) {
				agent.Account.register(dataRegister).then(() => {
					dispatch(signInUser(dataLogin));
					history.push(from);
				});
			} else {
				dispatch(signInUser(dataLogin));
				history.push(from);
			}
		}
	}, [googleUser, members, dispatch, from]);

	// FACIAL REGISTER
	useEffect(() => {
		if (dataFaceRegister && dataUserLogin) {
			const dataRegister = {
				email: dataUserLogin.email,
				password: dataFaceRegister.facialId + "ABCXYZ",
				username: dataUserLogin.username,
			};

			if (dataRegister !== undefined) {
				agent.Account.register(dataRegister).then(() => {
					Swal.fire({
						icon: "success",
						title: "You Has Create FaceID Successful",
						showConfirmButton: false,
						timer: 1500,
					});
				});
			}
		}
	}, [dataFaceRegister, dataUserLogin, members, dispatch, from]);
	//FACE LOGIN
	useEffect(() => {
		if (dataFaceLogin) {
			const dataLogin = {
				password: dataFaceLogin.facialId + "ABCXYZ",
				username: dataFaceLogin.payload.username,
			};

			// console.log(dataLogin);

			if (dataLogin) {
				dispatch(signInUser(dataLogin));
				history.push(from);
			} else {
				Swal.fire({
					icon: "success",
					title: "Don't have FaceID, please Register new FaceID",
					showConfirmButton: false,
					timer: 1500,
				});
			}
		}
	}, [dataFaceLogin, members, dispatch, from]);
	const usernamereq = t('Login_UsernameReq');
	const passreq = t('Login_PassReq');
	return (
		<div className="mt-5">
			<div className="max-w-[350px] md:max-w-[400px] border h-auto border-slate-300 rounded-2xl px-4 py-10 my-[100px] mx-auto">
				<div className="p-4 flex flex-col items-center">
					<div className="bg-indigo-600 p-4 text-white rounded-full">
						<LockOutlinedIcon />
					</div>
					<h1 className="font-bold text-2xl">{t('Login_Signin')}</h1>
					<form onSubmit={handleSubmit(submitForm)}>
						<TextField
							margin="normal"
							fullWidth
							label={t('Login_Username')}
							autoFocus
							{...register("username", {
								required: usernamereq,
							})}
							error={!!errors.username}
							helperText={errors?.username?.message}
						/>
						<TextField
							margin="normal"
							fullWidth
							label={t('Login_Pass')}
							type="password"
							{...register("password", {
								required: passreq,
							})}
							error={!!errors.password}
							helperText={errors?.password?.message}
						/>
						<button
							className="p-3 my-5 w-full c-btn"
							disabled={!isValid}
							type="submit">
							{t('Login_Signin')}
						</button>
						<hr />
						<div className="flex flex-col justify-center items-center gap-2">
							<p>{t('Login_Or')}</p>
							<div>
								<GoogleButton
									label={t('Login_GG') as string}
									onClick={handleGoogleSignIn}
								/>
							</div>
						</div>

						<div className="text-center mt-3">
							<Link to="/register">
								<h4>
									{t('Login_Account')}{" "}
									<span className="font-medium underline underline-offset-2 text-indigo-600 hover:text-indigo-400 duration-300">
										{t('Login_Signup')}
									</span>{" "}
								</h4>
							</Link>
							<div className="flex justify-center items-center gap-1 mt-5">
								<div
									className="c-btn cursor-pointer my-3 flex items-center gap-2"
									onClick={faceRegistration}>
									<TbFaceId size={20} />
									<span className="font-medium">
										Face Register
									</span>
								</div>
								<div
									className="c-btn cursor-pointer flex items-center gap-2"
									onClick={faceSignIn}>
									<TbFaceId size={20} />
									<span className="font-medium">
										Face Login
									</span>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
