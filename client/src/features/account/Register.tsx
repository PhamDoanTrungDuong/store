import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import { history } from "../..";

const Register = () => {
	type FormData = {
		email: string;
		password: string;
		username: string;
	};
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm<FormData>({
		mode: "all",
	});

	const handleApiErrors = (errors: any) => {
		if (errors) {
			errors.forEach((error: string) => {
				if (error.includes("Passwords")) {
					setError("password", {
						message: error,
					});
				} else if (error.includes("Email")) {
					setError("email", { message: error });
				} else if (error.includes("Username")) {
					setError("username", {
						message: error,
					});
				}
			});
		}
	};

	return (
		<div className="rounded-div mt-5">
			<div className="max-w-[500px] border h-auto border-slate-300 rounded-2xl px-4 py-10 my-[100px] mx-auto">
				<div className="p-4 flex flex-col items-center">
					<div className="bg-indigo-600 p-4 text-white rounded-full">
						<LockOutlinedIcon />
					</div>
					<h1 className="font-bold text-2xl">
						Sign Up
					</h1>
					<form
						onSubmit={handleSubmit((data) =>
							agent.Account.register(
								data
							)
								.then(() => {
									history.push(
										"/login"
									);
								})
								.catch(
									(
										error
									) =>
										handleApiErrors(
											error
										)
								)
						)}>
						<TextField
							margin="normal"
							fullWidth
							label="Username"
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
							label="Email"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^\w+[\w-.]*@\w+((-\w+)|(\w*)).[a-z]{2,3}$/,
									message: "Not a valid email address",
								},
							})}
							error={!!errors.email}
							helperText={
								errors?.email
									?.message!
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
									pattern: {
										value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
										message: "Password is not complex enough",
									},
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
							Register
						</button>
						<div className="text-center mt-3">
								<Link to="/login">
										<h4>
										Already have an account? <span className="font-medium underline underline-offset-2 text-indigo-600 hover:text-indigo-400 duration-300">Sign In</span>
										</h4>
								</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
