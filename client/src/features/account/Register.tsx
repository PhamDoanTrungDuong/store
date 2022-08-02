import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
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
		formState: { isSubmitting, errors, isValid },
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
			<Container
				component={Paper}
				maxWidth="sm"
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					p: 3,
					mb: 10,
					mt: 6,
				}}>
				<Box
					sx={{
						p: 4,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}>
					<div className="bg-indigo-600 p-4 text-white rounded-full">
						<LockOutlinedIcon />
					</div>
					<h1 className="font-bold text-2xl">
						Sign in
					</h1>
					<Box
						component="form"
						onSubmit={handleSubmit((data) =>
							agent.Account.register(
								data
							)
								.then(() => {
									toast.success(
										"Registration successful - you can now login"
									);
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
						)}
						noValidate
						sx={{ mt: 1 }}>
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
						<LoadingButton
							disabled={!isValid}
							loading={isSubmitting}
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}>
							Register
						</LoadingButton>
						<Grid container>
							<Grid item>
								<Link to="/login">
										<h4>
                      Already have an account? <span className="font-medium underline underline-offset-2 text-indigo-600 hover:text-indigo-400 duration-300">Sign In</span>
                      </h4>
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</div>
	);
};

export default Register;
