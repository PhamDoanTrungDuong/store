import React, { useEffect } from "react";
import { BsThreeDots, BsPeople, BsCart4 } from "react-icons/bs";
import { IoMdArrowDropup } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utilities/util";
import { fetchMemberCount } from "../account/accountSlice";
import { getProductCounterAsync } from "../catalog/catalogSlice";
import { fetchAllTotal } from "../orders/orderSlice";

const AdminHome: React.FC = () => {
	const dispatch = useAppDispatch();
	const { allTotal } = useAppSelector((state) => state.order);
	const { count } = useAppSelector((state) => state.account);
	const { productCount } = useAppSelector((state) => state.catalog);
	

	useEffect(() => {
		dispatch(fetchAllTotal());
		dispatch(fetchMemberCount());
		dispatch(getProductCounterAsync());
	}, [dispatch]);

	return (
		<>
			<div className="text-2xl font-bold my-4">Statistics</div>
			<div className="flex gap-4">
				<div className="text-white bg-gradient-to-r from-indigo-600 to-indigo-400 px-8 py-6 rounded-[30px] w-[30%] mb-4">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-indigo-600 rounded-2xl inline-block">
							<MdAttachMoney size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className="text-3xl font-bold">
							<p>{currencyFormat(allTotal)}</p>
						</div>
						<div className="flex font-medium justify-between items-center mt-1">
							<h1 className="text-xl font-bold">
								Total Sale
							</h1>
							<button className="py-2 px-4 hover:shadow-indigo-900 duration-300 bg-indigo-500 shadow-md rounded-full flex">
								+2,36% <IoMdArrowDropup size={20} />
							</button>
						</div>
					</div>
				</div>

				<div className="text-white bg-gradient-to-r from-green-600 to-green-400 px-8 py-6 rounded-[30px] w-[30%] mb-4">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-green-600 rounded-2xl inline-block">
							<BsPeople size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className="text-3xl font-bold">
							<p>+{count}</p>
						</div>
						<div className="flex font-medium justify-between items-center mt-1">
							<h1 className="text-xl font-bold">
								Total Users
							</h1>
							<button className="py-2 px-4 hover:shadow-green-900 duration-300 bg-green-500 shadow-md rounded-full flex">
								+4,23% <IoMdArrowDropup size={20} />
							</button>
						</div>
					</div>
				</div>

				<div className="text-white bg-gradient-to-r from-cyan-600 to-cyan-400 px-8 py-6 rounded-[30px] w-[30%] mb-4">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-cyan-600 rounded-2xl inline-block">
							<BsCart4 size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className="text-3xl font-bold">
							<p>{productCount}</p>
						</div>
						<div className="flex font-medium justify-between items-center mt-1">
							<h1 className="text-xl font-bold">
								Total Product
							</h1>
							<button className="py-2 px-4 hover:shadow-cyan-900 duration-300 bg-cyan-500 shadow-md rounded-full flex">
								+2 <IoMdArrowDropup size={20} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminHome;
