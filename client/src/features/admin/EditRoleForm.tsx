import React from 'react'
import { IUsers } from '../../app/interfaces/IUsers';
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import agent from '../../app/api/agent';
import { useForm, } from 'react-hook-form';
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";


interface IProps {
      user?: IUsers;
      cancelEdit: () => void;
  }

  const availableRoles: any[] = [
    {name: 'Admin', value: 'Admin'},
    {name: 'Member', value: 'Member'},
    {name: 'Moderator', value: 'Moderator'}
  ];

  interface IFormInput {
    name: string;
    value: string;
  }

const EditRoleForm: React.FC<IProps> = ({user, cancelEdit}) => {
	const { register, handleSubmit } = useForm<IFormInput>();
	async function handleSubmitData(data: any) {
            try {
                  await agent.Admin.editRole(user?.username!, data.value);
                	cancelEdit();
            } catch (error: any) {
                	console.log(error)
            }
        }

	const handleChecked = (role: string) => {
		const item = user?.roles.includes(role);
		return item ? true : false
	}
  return (
    <div className='h-[300px] mt-24 p-5'>
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
							Edit Role for {user?.username}
						</h1>
					</Link>
        </div>
      <div className="mx-auto p-5 w-full h-full flex flex-col justify-center items-center">
        <div>
          <form onSubmit={handleSubmit(handleSubmitData)}>
	    		{availableRoles.map((role, idx) => {
                      return (
                        <div key={idx}>
                          <input id={role.name} value={role.value} {...register("value")} className='mr-2' type="checkbox" disabled={role.name === 'Admin' && user?.username === 'admin'} defaultChecked={handleChecked(role.value)} />
                          <label className='text-lg font-medium cursor-pointer' htmlFor={role.name}>{role.name}</label>
                        </div>
                      )
                    })}
                  <div className="mt-4">
                      <LoadingButton type='submit' variant='contained' color='success'>Submit</LoadingButton>
                      <span  className="ml-4">
                        <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                      </span>
                  </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditRoleForm