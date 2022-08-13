import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { FieldValues, useForm } from "react-hook-form";
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";
import { history } from "../..";

const Login = () => {
	type FormData = {
		password: string;
		username: string;
	};

	type LocationProps = {
		state: {
			from: Location;
		};
	};

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

	return (
		<div className="mt-5">
			<div className="max-w-[350px] md:max-w-[400px] border h-auto border-slate-300 rounded-2xl px-4 py-10 my-[100px] mx-auto">
				<div className="p-4 flex flex-col items-center">
					<div className="bg-indigo-600 p-4 text-white rounded-full">
						<LockOutlinedIcon />
					</div>
					<h1 className="font-bold text-2xl">
						Sign in
					</h1>
					<form onSubmit={handleSubmit(
							submitForm
						)}>
						<TextField
							margin="normal"
							fullWidth
							label="Username"
							autoFocus
							{...register(
								"username",
								{
									required: "Username is required",
								}
							)}
							error={
								!!errors.username
							}
							helperText={
								errors?.username
									?.message
							}
						/>
						<TextField
							margin="normal"
							fullWidth
							label="Password"
							type="password"
							{...register(
								"password",
								{
									required: "Username is required",
								}
							)}
							error={
								!!errors.password
							}
							helperText={
								errors?.password
									?.message
							}
						/>
						<button
							className="p-3 my-5 w-full c-btn"
							disabled={!isValid}
							type="submit">
							Sign In
						</button>
						<div className="text-center mt-3">
								<Link to="/register">
										<h4>Don't have an account? <span className="font-medium underline underline-offset-2 text-indigo-600 hover:text-indigo-400 duration-300">Sign Up</span> </h4>
								</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
