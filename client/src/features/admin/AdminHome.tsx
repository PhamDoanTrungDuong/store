import React, { useEffect, useState } from "react";
import { BsThreeDots, BsPeople, BsCart4 } from "react-icons/bs";
import { IoIosArrowForward, IoMdArrowDropup } from "react-icons/io";
import { MdAttachMoney } from "react-icons/md";
import useMembers from "../../app/hooks/useMembers";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utilities/util";
import { fetchMemberCount } from "../account/accountSlice";
import { getProductCounterAsync } from "../catalog/catalogSlice";
import { fetchAllTotal } from "../orders/orderSlice";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosStats } from "react-icons/io";
import { Link } from "react-router-dom";
import ViewDatePicker from "../../app/components/ViewDatePicker";


const AdminHome: React.FC = () => {
	const { members } = useMembers();
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
			<div className="flex items-center ml-2 mb-12 mt-24">
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
						<IoIosStats size={20} />
						Statistic
					</h1>
				</Link>
			</div>
			<div className="flex justify-start gap-4">
				<div className="text-white bg-gradient-to-r from-indigo-600 to-indigo-400 px-8 py-6 rounded-[30px] w-[30%] mb-4 shadow-xl">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-indigo-600 rounded-2xl inline-block">
							<MdAttachMoney size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className="text-3xl font-bold">
							<p>$1000.00</p>
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

				{/* <div className="text-white bg-gradient-to-r from-cyan-600 to-cyan-400 px-8 py-6 rounded-[30px] w-[30%] mb-4 shadow-xl">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-cyan-600 rounded-2xl inline-block">
							<BsCart4 size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className="text-3xl font-bold">
							<p>{productCount} Products</p>
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

				<div className="text-white bg-gradient-to-r from-green-600 to-green-400 px-8 py-6 rounded-[30px] w-[30%] mb-4 shadow-xl">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-green-600 rounded-2xl inline-block">
							<BsPeople size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className=" flex gap-x-6 text-3xl font-bold">
							<div className="flex mb-5 -space-x-4">
								{members.slice(0, 3).map((i, idx) => {
									return (
										<img
											key={
												idx
											}
											className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
											src={
												i.userName.includes(
													"admin"
												)
													? "/images/admin.jpg"
													: i.pictureUrl ===
													  null
													? "/images/empty-user.png"
													: i.pictureUrl
											}
											alt={
												i.userName
											}
										/>
									);
								})}
								<a
									className="flex justify-center items-center w-10 h-10 text-xs font-medium text-white bg-gray-700 rounded-full border-2 border-white hover:bg-gray-600 dark:border-gray-800"
									href="#">
									+
									{count - 3 < 0
										? 0
										: count - 3}
								</a>
							</div>
							<p>{count} Users</p>
						</div>
						<div className="flex font-medium justify-between items-center mt-1">
							<h1 className="text-xl font-bold">
								Total Users
							</h1>
							<button className="py-2 px-4 hover:shadow-green-900 duration-300 bg-green-500 shadow-md rounded-full flex">
								+3 <IoMdArrowDropup size={20} />
							</button>
						</div>
					</div>
				</div> */}
			</div>
			{/* <div className="rounded-div2 mt-10">
				<ViewDatePicker />
			</div> */}
		</>
	);
};

export default AdminHome;
