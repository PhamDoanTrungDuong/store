import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { IUsers } from "../../app/interfaces/IUsers";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchUsers } from "../account/accountSlice";
import EditRoleForm from "./EditRoleForm";
import { Link } from "react-router-dom";

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
		<div className=" mt-5 p-5">
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
			<div className="h-[600px] overflow-y-scroll">
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left">
									Username
								</TableCell>
								<TableCell align="left">
									Role
								</TableCell>
								<TableCell align="left">
									Edit
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users?.map((item: any) => {
								return (
									<TableRow key={item.id}>
										<TableCell>
											{item.id}
										</TableCell>
										<TableCell>
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
												<span className='flex items-center capitalize'>
													{
														item.username
													}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<p className="font-medium text-md">
												{item.roles.join(
													", "
												)}
											</p>
										</TableCell>
										<TableCell>
											{item.username ===
												"admin" &&
											item.roles.includes(
												"Admin"
											) ? (
												<div></div>
											) : (
												<button
													className="px-4 py-2 text-white border border-amber-500 font-bold bg-amber-500 hover:bg-transparent hover:text-amber-500 duration-200 rounded-lg"
													onClick={() =>
														handleSelectUser(
															item
														)
													}>
													Edit
												</button>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default AdminRole;
