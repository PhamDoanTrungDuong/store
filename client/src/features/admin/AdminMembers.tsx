import { Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	TableContainer,
	Paper,
	Table,
	Box,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
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
import { AiOutlineHome } from "react-icons/ai";
import { HiOutlineUsers } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const AdminMembers: React.FC = () => {
	const { members, pagination } = useMembers();
	const [loading, setLoading] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [target, setTarget] = useState("");
	const dispatch = useAppDispatch();

	const [selectedMember, setSelectedMember] = useState<IUser | undefined>(undefined);

	if (loading) return <Loading message="Loading orders" />;

	function cancelEdit() {
		if (selectedMember) setSelectedMember(undefined);
		setEditMode(false);
	}

	const handleDeleteProduct = async (id: string) => {
		setLoading(true);
		setTarget(id);
		await agent.Admin.deleteMember(id)
			.then(() => dispatch(removeMember(id)))
			.catch((error) => console.log(error))
			.finally(() => setLoading(false));
	};

	if (editMode) return <MemberForm member={selectedMember} cancelEdit={cancelEdit} />;


	return (
		<div className="mt-5 p-5">
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
			<div className="flex justify-between items-center">
				<div></div>
				<div className="w-[60%]">
					<MemberSearch />
				</div>
				<div className="p-4">
					<button
						onClick={() => setEditMode(true)}
						className="border text-white px-6 py-1 border-indigo-600 bg-indigo-600 text-lg rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
						Create
					</button>
				</div>
			</div>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Id</TableCell>
							<TableCell align="left">Username</TableCell>
							<TableCell align="right">
								FullName
							</TableCell>
							<TableCell align="center">
								Phone Number
							</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">City</TableCell>
							<TableCell align="center">
								Address
							</TableCell>
							<TableCell align="center">
								Country
							</TableCell>
							{/* <TableCell align="center">Active</TableCell> */}
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{members?.map((member: any, idx) => (
							<TableRow
								key={idx}
								sx={{
									"&:last-child td, &:last-child th":
										{
											border: 0,
										},
								}}>
								<TableCell
									component="th"
									scope="row">
									{member.id}
								</TableCell>
								<TableCell align="left">
									<Box
										display="flex"
										alignItems="center">
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
												height: 50,
												marginRight: 20,
											}}
											className="rounded-full"
										/>
										<span>
											{
												member.userName
											}
										</span>
									</Box>
								</TableCell>
								<TableCell align="left">
									<span>
										{member?.address
											?.fullName
											? member
													?.address
													?.fullName
											: "-"}
									</span>
								</TableCell>
								<TableCell align="left">
									<span>
										{member?.phoneNumber
											? member?.phoneNumber
											: "-"}
									</span>
								</TableCell>
								<TableCell align="left">
									<span>{member?.email}</span>
								</TableCell>
								<TableCell align="left">
									<span>
										{member?.address
											?.city
											? member
													?.address
													?.city
											: "-"}
									</span>
								</TableCell>
								<TableCell align="left">
									<span>
										{member?.address
											?.address1
											? member
													?.address
													?.address1
											: "-"}
									</span>
								</TableCell>
								<TableCell align="left">
									<span>
										{member?.address
											?.country
											? member
													?.address
													?.country
											: "-"}
									</span>
								</TableCell>
								{/* <TableCell align="left">
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
								</TableCell> */}
								<TableCell align="right">
									<LoadingButton
										onClick={() =>
											handleDeleteProduct(
												member.id
											)
										}
										loading={
											loading &&
											target ===
												member.id
										}
										startIcon={
											<Delete />
										}
										color="error"
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{pagination && (
				<Box sx={{ pt: 2, mb: 5 }}>
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
	);
};

export default AdminMembers;
