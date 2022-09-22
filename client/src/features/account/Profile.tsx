import React, { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import agent from "../../app/api/agent";
import { useAppSelector } from "../../app/store/configureStore";
import ProfileForm from "./ProfileForm";
import Loading from "../../app/layout/Loading";

const Profile: React.FC = () => {
	const { user } = useAppSelector((state) => state.account);
	const [loading, setLoading] = useState(false);

	const methods = useForm({
		mode: "all",
	});

	useEffect(() => {
		agent.Account.currentUser().then((res) => {
			if (res) {
				methods.reset({
					...methods.getValues(),
					...res,
					...res.address,
				});
			}
		});
	}, [methods]);

	async function handleSubmitData(data: FieldValues) {
		try {
			if (data) {
				setLoading(true)
				let response = await agent.Profile.updateProfile(data)
				if (response) {
					setLoading(false)
					Swal.fire({
						icon: "success",
						title: "Update Profile Successful",
						showConfirmButton: false,
						timer: 1500,
					});
				} else {
					Swal.fire({
						icon: "error",
						title: "Failed To Update Profile",
						showConfirmButton: false,
						timer: 1500,
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	if (loading) return <Loading message="Updating user..." />;

	return (
		<div className="h-[800px] my-5 p-5">
			<div className="flex items-center ml-2 mt-3 mb-5">
				<Link to="/">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineHome size={20} />
						Home
					</h1>
				</Link>
				<div className="mx-2">
					<IoIosArrowForward size={15} />
				</div>
				<Link to="/profile">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<BiUser size={20} />
						Profile
					</h1>
				</Link>
			</div>
			<div className="">
				<img
					className="w-[15%] mx-auto hover:scale-105 duration-200 border border-gray-300 cursor-pointer rounded-full"
					src={
						user?.pictureUrl
							? user?.pictureUrl
							: "/images/empty-user.png"
					}
					alt={user?.userName}
				/>
			</div>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(handleSubmitData)}>
					<ProfileForm user={user} />
					<button
						type="submit"
						className="bg-indigo-600 border border-indigo-600 text-white px-4 p-2 w-full rounded-xl shadow-xl mt-10 hover:shadow-2xl my-2 hover:bg-transparent hover:text-indigo-600 duration-200">
						Save Changes
					</button>
				</form>
			</FormProvider>
		</div>
	);
};

export default Profile;
