import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { IUsers } from "../../app/interfaces/IUsers";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchUsers } from "../account/accountSlice";
import EditRoleForm from "./EditRoleForm";
import { Link } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";

const AdminRole: React.FC = () => {
	const { users } = useAppSelector((state) => state.account);
	const dispatch = useAppDispatch();
	const [editMode, setEditMode] = useState(false);
	const [selectedUser, setSelectedUser] = useState<IUsers | undefined>(undefined);

	const initApp = useCallback(async () => {
		try {
			await dispatch(fetchUsers());
		} catch (error) {
			console.log(error);
		}
	}, [dispatch]);

	useEffect(() => {
		initApp();
	}, [initApp]);

	function handleSelectUser(user: IUsers) {
		setSelectedUser(user);
		setEditMode(true);
	}

	function cancelEdit() {
		if (selectedUser) setSelectedUser(undefined);
		setEditMode(false);
	}

	if (editMode) return <EditRoleForm user={selectedUser} cancelEdit={cancelEdit} />;

	return (
		<div className=" mt-24 p-5">
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
						<MdManageAccounts size={20} />
						Roles
					</h1>
				</Link>
			</div>
			<div className="rounded-div2 p-0">
				<div className="h-[600px] overflow-y-scroll mt-5">
					<table className="table-auto w-full text-xs sm:text-sm md:text-base">
						<thead>
							<tr className="border-b border-gray-200">
								<td
									className="px-4 py-3"
									align="center">
									#
								</td>
								<td
									className="px-4 py-3"
									align="left">
									Username
								</td>
								<td
									className="px-4 py-3"
									align="left">
									Role
								</td>
								<td
									className="px-4 py-3"
									align="left"></td>
							</tr>
						</thead>
						<tbody>
							{users?.map((item: any) => {
								return (
									<tr
										key={item.id}
										className="border-b border-gray-200">
										<td
											className="py-7"
											align="center">
											{item.id}
										</td>
										<td>
											<div className="flex text-lg font-bold">
												<img
													src={
														item?.pictureUrl
															? item?.pictureUrl
															: "/images/empty-user.png"
													}
													alt={
														item.username
													}
													style={{
														height: 50,
														marginRight: 20,
													}}
													className="rounded-full"
												/>
												<span className="flex items-center capitalize">
													{
														item.username
													}
												</span>
											</div>
										</td>
										<td>
											<p className="font-medium text-md">
												{item.roles.join(
													", "
												)}
											</p>
										</td>
										<td className="flex justify-center items-center gap-2 mt-[20%]">
											{item.username ===
												"admin" &&
											item.roles.includes(
												"Admin"
											) ? (
												<div></div>
											) : (
												<div
												className="p-2 hover:bg-yellow-200/30 rounded-full duration-200 cursor-pointer"
													onClick={() =>
														handleSelectUser(
															item
														)
													}>
													<FiEdit3
														size={
															20
														}
														className="text-yellow-500"
													/>
												</div>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AdminRole;
