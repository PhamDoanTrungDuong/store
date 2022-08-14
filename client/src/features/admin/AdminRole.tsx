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
import { IUsers } from "../../app/interfaces/IUsers";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchUsers } from "../account/accountSlice";
import EditRoleForm from "./EditRoleForm";

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
	});

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
			<h4 className="text-2xl font-bold my-4">Roles</h4>
			<div className="h-[600px] overflow-y-scroll">
				<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell align="left">Username</TableCell>
							<TableCell align="left">Role</TableCell>
							<TableCell align="left">Edit</TableCell>
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
										<span className="font-bold text-lg">
											{
												item.username
											}
										</span>
									</TableCell>
									<TableCell>
										{item.roles.join(
											", "
										)}
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
