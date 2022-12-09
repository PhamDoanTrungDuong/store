import React, { useEffect, useState } from "react";
import { fetchMembersAsync } from "../../features/account/accountSlice";
import agent from "../api/agent";
import { useAppDispatch } from "../store/configureStore";
import { ImLock, ImUnlocked } from 'react-icons/im'
interface Props {
	id: string;
      lockoutEnabled: boolean;
      lockoutEnd: any;
}
const AppSwitch: React.FC<Props> = ({ id, lockoutEnabled, lockoutEnd }) => {
      const [ loading, setLoading ] = useState(false);
      const dispatch = useAppDispatch();
      const lockUser = async (id: string) => {
            await agent.Admin.lockUser(id).then(() => {
                  setLoading(true);
            })
            // console.log(lockoutEnabled + " " + lockoutEnd + " " + id)
      }

      useEffect(() => {
            if(loading) dispatch(fetchMembersAsync()).then(() => setLoading(false));
      }, [dispatch, loading]);
      
	return (
		<form>
			<label
				htmlFor={id}
				className="inline-flex relative items-center mr-4 cursor-pointer">
				<input
                              onClick={() => lockUser(id)}
					type="checkbox"
					id={id}
					className="sr-only peer"
					defaultChecked={!(lockoutEnabled === true && lockoutEnd !== null) ? true : false}
				/>
				<div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-500  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
				<span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-500">
					{(lockoutEnabled === true && lockoutEnd !== null) ? <span className="font-medium text-red-600"><ImLock size={20}/></span> : <span className="font-medium text-green-400"><ImUnlocked size={20} /></span>}
				</span>
			</label>
		</form>
	);
};

export default AppSwitch;
