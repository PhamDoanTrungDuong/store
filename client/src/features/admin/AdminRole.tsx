import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { IUsers } from "../../app/interfaces/IUsers";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchUsers, setRoleState } from "../account/accountSlice";
import EditRoleForm from "./EditRoleForm";
import { Link } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import { LoadingButton } from "@mui/lab";
import Loading from "../../app/layout/Loading";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const availableRoles: any[] = [
	{name: '', value: ''},
	{name: 'Member', value: 'Member'},
	{name: 'Admin', value: 'Admin'},
    {name: 'Moderator', value: 'Moderator'}
  ];

  interface IFormInput {
	name: string;
	value: string;
 }

const AdminRole: React.FC = () => {
	const { users, accountState} = useAppSelector((state) => state.account);
	const dispatch = useAppDispatch();
	const [selectedUser, setSelectedUser] = useState<IUsers | undefined>(undefined);

	const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

	const initApp = useCallback(async () => {
		accountState ? await dispatch(fetchUsers()) : await dispatch(fetchUsers())
	}, [dispatch, accountState]);

	useEffect(() => {
		initApp();
	}, [initApp]);

	function handleSelectUser(user: IUsers) {
		setSelectedUser(user);
	}

	function cancelEdit() {
		if (selectedUser) setSelectedUser(undefined);
	}

	const { register, handleSubmit } = useForm<IFormInput>();
	async function handleSubmitData(data: any) {
            try {
                  await agent.Admin.editRole(selectedUser?.username!, data.value).then(() => {
							handleClose()
						});
                  dispatch(setRoleState())
                	cancelEdit();
            } catch (error: any) {
                	console.log(error)
            }
        }

	const handleChecked = (role: string) => {
		return selectedUser?.roles.includes(role) ? true : false;
	}
	if (!users) return <Loading message="Loading users" />;

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
							{users?.map((item: any) => (
								item.username === "admin" ? "" : (
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
													onClick={() => {
														handleOpen()
														handleSelectUser(
															item
														)
													}
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
								)
							))}
						</tbody>
					</table>
				</div>
			</div>
			<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Role For {selectedUser?.username}
          </Typography>
          <div className="mx-auto p-5 w-full h-full flex flex-col justify-center items-center">
        <div>
          <form onSubmit={handleSubmit(handleSubmitData)}>
	    		{availableRoles.map((role, idx) => {
                      return (
                        <div key={idx}>
                          <input id={role.name} value={role.value} hidden={idx===0?true:false} {...register("value")} className='mr-2' type="checkbox" defaultChecked={handleChecked(role.name)} />
                          <label className='text-lg font-medium cursor-pointer' htmlFor={role.name}>{role.name}</label>
                        </div>
                      )
                    })}
                  <div className="mt-4">
                      <LoadingButton type='submit' variant='contained' color='success'>Submit</LoadingButton>
                      <span  className="ml-4">
                        <Button onClick={handleClose} variant='contained' color='inherit'>Cancel</Button>
                      </span>
                  </div>
          </form>
        </div>
      </div>
        </Box>
      </Modal>
		</div>
	);
};

export default AdminRole;
