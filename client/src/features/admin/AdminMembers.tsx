import { Delete } from "@mui/icons-material";
import {
	Button,
} from "@mui/material";
import React, { useState } from "react";
import agent from "../../app/api/agent";
import useMembers from "../../app/hooks/useMembers";
import { IUser } from "../../app/interfaces/IUser";
import Loading from "../../app/layout/Loading";
import MemberForm from "./MemberForm";
import AppPagination from "../../app/components/AppPagination";
import { removeMember, setPageNumber } from "../account/accountSlice";
import { useAppDispatch } from "../../app/store/configureStore";
import MemberSearch from "../../app/components/MemberSearch";
import { AiOutlineHome, AiOutlinePlus } from "react-icons/ai";
import { HiOutlineUsers } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Swal from "sweetalert2";
import { FiTrash2 } from "react-icons/fi";

const AdminMembers: React.FC = () => {
	const { members, pagination } = useMembers();
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [target, setTarget] = useState("");
	const dispatch = useAppDispatch();

	const [selectedMember, setSelectedMember] = useState<IUser | undefined>(undefined);

	if (loading || !members) return <Loading message="Loading orders" />;

	function cancelEdit() {
		if (selectedMember) setSelectedMember(undefined);
		setEditMode(false);
	}

	const DeleteMember = async (id: string) => {
		setLoading(true);
		setTarget(id);
		let response = await agent.Admin.deleteMember(id)
			.then(() => dispatch(removeMember(id)))
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
		return response
	};

	if (editMode) return <MemberForm member={selectedMember} cancelEdit={cancelEdit} />;

	const handleDeleteMember = (id: string) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		 }).then((result) => {
			if (result.isConfirmed) {
				DeleteMember(id).then(() => {
					Swal.fire(
					  'Deleted!',
					  'Member has been deleted.',
					  'success'
					)
				})
			}
		 })
	}

	return (
		<div className="mt-24 p-5">
			<div className="flex justify-between items-center mb-8">
				<div className="flex items-center ml-2 mb-5">
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
							Users
						</h1>
					</Link>
				</div>
				<div>
						<button
							onClick={() => setEditMode(true)}
							className="flex items-center gap-2 border text-white px-3 py-2 border-indigo-600 bg-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
							<AiOutlinePlus />
							New User
						</button>
				</div>
			</div>
			<div className="rounded-div2 p-0">
				<div className="flex justify-between items-center p-6">
					<div className="w-[30%]">
						<MemberSearch />
					</div>
					<div></div>
				</div>
					<table className="table-auto w-full text-xs sm:text-sm md:text-base">
						<thead>
							<tr className="border-b border-gray-200">
								<td className="px-4 py-3" align="center">Id</td>
								<td className="px-4 py-3" align="left">Image</td>
								<td className="px-4 py-3" align="right">
									FullName
								</td>
								<td className="px-4 py-3" align="center">
									Phone Number
								</td>
								<td className="px-4 py-3" align="center">Email</td>
								<td className="px-4 py-3" align="center">City</td>
								<td className="px-4 py-3" align="center">
									Address
								</td>
								<td className="px-4 py-3" align="center">
									Country
								</td>
								{/* <td className="px-4 py-3" align="center">Active</td> */}
								<td className="px-4 py-3" align="right"></td>
							</tr>
						</thead>
						<tbody>
							{members?.map((member: any, idx) => (
								member.userName === "admin" ? "" : (
									<tr
									className="border-b border-gray-200"
									key={idx}>
									<td className="py-7" align="center">
										{member.id}
									</td>
									<td align="center">
										<div>
											<img
												src={
													member?.pictureUrl
														? member?.pictureUrl
														: "/images/empty-user.png"
												}
												alt={
													member.userName
												}
												style={{
													height: 40,
													marginRight: 15,
												}}
												className="rounded-full"
											/>
											{/* <span>
												{
													member.userName
												}
											</span> */}
										</div>
									</td>
									<td align="center">
										<span>
											{member?.address
												?.fullName
												? member
														?.address
														?.fullName
												: "-"}
										</span>
									</td>
									<td align="center">
										<span>
											{member?.phoneNumber
												? member?.phoneNumber
												: "-"}
										</span>
									</td>
									<td align="center">
										<span>{member?.email}</span>
									</td>
									<td align="center">
										<span>
											{member?.address
												?.city
												? member
														?.address
														?.city
												: "-"}
										</span>
									</td>
									<td align="left">
										<span>
											{member?.address
												?.address1
												? member
														?.address
														?.address1
												: "-"}
										</span>
									</td>
									<td align="center">
										<span>
											{member?.address
												?.country
												? member
														?.address
														?.country
												: "-"}
										</span>
									</td>
									{/* <td align="left">
										{member.userName ===
										"admin" ? (
											<div></div>
										) : (
											<AppSwitch
												id={
													member.id
												}
												lockoutEnabled={
													member.lockoutEnabled
												}
												lockoutEnd={
													member.lockoutEnd
												}
											/>
										)}
									</td> */}
									{/* <td align="right" className="flex justify-center items-center gap-2 mt-[35%]">
										<div
										className="p-2 hover:bg-red-300/30 rounded-full duration-200 cursor-pointer"
											onClick={() =>
												handleDeleteMember(
													member.id
												)
											}
										>
												<FiTrash2 size={20} className='text-red-600' />
											</div>
									</td> */}
								</tr>
								)
							))}
						</tbody>
					</table>
				{pagination && (
					<Box sx={{ pt: 2, mb: 5, ml: 3 }}>
						<AppPagination
							pagination={pagination}
							onPageChange={(page: number) =>
								dispatch(
									setPageNumber({
										pageNumber: page,
									})
								)
							}
						/>
					</Box>
				)}
			</div>
		</div>
	);
};

export default AdminMembers;
