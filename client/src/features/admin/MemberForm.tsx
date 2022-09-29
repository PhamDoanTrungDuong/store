import { Typography, TextField } from "@mui/material";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import { IUser } from "../../app/interfaces/IUser";
import { useAppDispatch } from "../../app/store/configureStore";
import { setMember } from "../account/accountSlice";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { HiOutlineUsers } from "react-icons/hi";
interface Props {
	member?: IUser;
	cancelEdit: () => void;
}

const MemberForm: React.FC<Props> = ({ member, cancelEdit }) => {
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
	const dispatch = useAppDispatch();

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

	async function handleSubmitData(data: FieldValues) {
            try {
                let response: IUser;
                response = await agent.Account.register(data).catch((error) => handleApiErrors(error))
                dispatch(setMember(response));
                cancelEdit();
            } catch (error) {
                console.log(error)
            }
        }

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
							<HiOutlineUsers size={20} />
							New Member
						</h1>
					</Link>
				</div>
			<form onSubmit={handleSubmit(handleSubmitData)}>
				<TextField
					margin="normal"
					fullWidth
					label="Username"
					{...register("username", {
						required: "Username is required",
					})}
					error={!!errors.username}
					helperText={errors?.username?.message}
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
					helperText={errors?.email?.message!}
				/>
				<TextField
					margin="normal"
					fullWidth
					label="Password"
					type="password"
					{...register("password", {
						required: "Username is required",
						pattern: {
							value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
							message: "Password is not complex enough",
						},
					})}
					error={!!errors.password}
					helperText={errors?.password?.message}
				/>
				<div className="flex justify-between items-center gap-4">
					<button
						className="p-3 my-5 w-full c-btn bg-zinc-300 border-none text-black hover:border-2 hover:border-black"
						onClick={cancelEdit}>
						Cancel
					</button>
					<button
						className={!isValid ? "p-3 my-5 w-full bg-slate-400 rounded-lg" : "p-3 my-5 w-full c-btn"}
						disabled={!isValid}
						type="submit">
						Create
					</button>
				</div>
			</form>
		</div>
	);
};

export default MemberForm;
