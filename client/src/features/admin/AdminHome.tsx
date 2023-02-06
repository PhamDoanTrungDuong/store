import React, { useEffect, useState } from "react";
import { BsThreeDots, BsPeople, BsCart4 } from "react-icons/bs";
import { IoIosArrowForward, IoMdArrowDropup } from "react-icons/io";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import useMembers from "../../app/hooks/useMembers";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/utilities/util";
import { fetchMemberCount } from "../account/accountSlice";
import { fetchProductAsync, getProductCounterAsync, productSelector } from "../catalog/catalogSlice";
import { fetchAllTotal } from "../orders/orderSlice";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosStats } from "react-icons/io";
import { Link } from "react-router-dom";
import ViewDatePicker from "../../app/components/ViewDatePicker";
import { bestSellerProduct, lessInteractionProduct, statisticsTodaySales } from "./adminSlice";
import agent from "../../app/api/agent";
import { TbGift, TbHome2 } from "react-icons/tb";
import { RiTruckLine, RiRefund2Line } from "react-icons/ri";
import { MdOutlineCardGiftcard } from "react-icons/md";

const AdminHome: React.FC = () => {
	const { members } = useMembers();
	const dispatch = useAppDispatch();
	const { allTotal } = useAppSelector((state) => state.order);
	const { count } = useAppSelector((state) => state.account);
	const { productCount } = useAppSelector((state) => state.catalog);
	const { todaySales, bestSeller, lessInteract } = useAppSelector((state) => state.admin);
	const [deliveryState, setDeliveryState] = useState<any>();


	useEffect(() => {
		dispatch(fetchAllTotal());
		dispatch(fetchMemberCount());
		dispatch(getProductCounterAsync());
		dispatch(statisticsTodaySales());
		dispatch(bestSellerProduct());
		dispatch(lessInteractionProduct());
		if (deliveryState === undefined) {
			agent.Admin.orderDeliveryState().then((res) => {
				setDeliveryState(res);
			});
		}
	}, [dispatch, deliveryState]);

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
			<div className="flex justify-center gap-4">
				<div className="text-white bg-gradient-to-r from-indigo-600 to-indigo-400 px-8 py-6 rounded-[30px] w-[30%] mb-4 shadow-xl">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-indigo-600 rounded-2xl inline-block">
							<MdAttachMoney size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className="text-xl font-bold">
							<p>{currencyFormat(allTotal)}</p>
						</div>
						<div className="flex font-medium justify-between items-center mt-1">
							<h1 className="text-md font-bold">
								Total Revenue
							</h1>
							<button className="py-2 px-4 hover:shadow-indigo-900 duration-300 bg-indigo-500 shadow-md rounded-full flex">
								+2,36% <IoMdArrowDropup size={20} />
							</button>
						</div>
					</div>
				</div>

				<div className="text-white bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 px-8 py-6 rounded-[30px] w-[30%] mb-4 shadow-xl">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-fuchsia-600 rounded-2xl inline-block">
							<MdAttachMoney size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className="text-xl font-bold">
							<p>{currencyFormat(todaySales)}</p>
						</div>
						<div className="flex font-medium justify-between items-center mt-1">
							<h1 className="text-md font-bold">
								Today's Sales
							</h1>
							<button className="py-2 px-4 hover:shadow-fuchsia-900 duration-300 bg-fuchsia-500 shadow-md rounded-full flex">
								0% <IoMdArrowDropup size={20} />
							</button>
						</div>
					</div>
				</div>

				<div className="text-white bg-gradient-to-r from-cyan-600 to-cyan-400 px-8 py-6 rounded-[30px] w-[30%] mb-4 shadow-xl">
					<div className="flex justify-between mb-3">
						<div className="p-3 bg-white text-cyan-600 rounded-2xl inline-block">
							<BsCart4 size={25} />
						</div>
						<BsThreeDots className="cursor-pointer" size={20} />
					</div>
					<div className="relative mt-5">
						<div className="text-xl font-bold">
							<p>{productCount} Products</p>
						</div>
						<div className="flex font-medium justify-between items-center mt-1">
							<h1 className="text-md font-bold">
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
						<div className=" flex justify-center items-center gap-x-6 text-xl font-bold">
							<div className="flex -space-x-4">
								{members
									.slice(0, 3)
									.map((i, idx) => {
										return (
											<img
												key={
													idx
												}
												className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
												// src={
												// 	i.username.includes(
												// 		"admin"
												// 	)
												// 		? "/images/admin.jpg"
												// 		: i.pictureUrl ===
												// 		  null
												// 		? "/images/empty-user.png"
												// 		: i.pictureUrl
												// }
												src={
													i.pictureUrl ===
													null
														? "/images/empty-user.png"
														: i.pictureUrl
												}
												alt={
													i.username
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
							<h1 className="text-md font-bold">
								Total Users
							</h1>
							<button className="py-2 px-4 hover:shadow-green-900 duration-300 bg-green-500 shadow-md rounded-full flex">
								+3 <IoMdArrowDropup size={20} />
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="rounded-div2 mt-5">
				<h3 className="font-medium text-lg p-2 mb-5">Order Statistics</h3>

				<div className="flex justify-center gap-4">
					<div className="text-[#637381] flex justify-center items-center gap-5 bg-white p-5 w-[20%] mb-4 shadow-xl rounded-md border border-gray-300/50">
						<div className="p-3 rounded-xl bg-blue-400">
							<BsCart4
								size={30}
								className="text-white "
							/>
						</div>
						<div className="relative">
							<div className="flex font-medium justify-between">
								<h1 className="text-md font-bold">
									Order
								</h1>
							</div>
							<div className="text-xl font-bold">
								<p className="font-bold text-center">
									{deliveryState &&
										deliveryState.order}
								</p>
							</div>
						</div>
					</div>

					<div className="text-[#637381] flex justify-center items-center gap-5 bg-white p-5 w-[20%] mb-4 shadow-xl rounded-md border border-gray-300/50">
						<div className="p-3 rounded-xl bg-indigo-400">
							<TbGift size={30} className="text-white " />
						</div>
						<div className="relative">
							<div className="flex font-medium justify-between">
								<h1 className="text-md font-bold">
									Pending Order
								</h1>
							</div>
							<div className="text-xl font-bold">
								<p className="font-bold text-center">
									{deliveryState &&
										deliveryState.pending}
								</p>
							</div>
						</div>
					</div>

					<div className="text-[#637381] flex justify-center items-center gap-5 bg-white p-5 w-[20%] mb-4 shadow-xl rounded-md border border-gray-300/50">
						<div className="p-3 rounded-xl bg-red-400">
							<RiTruckLine
								size={30}
								className="text-white "
							/>
						</div>
						<div className="relative">
							<div className="flex font-medium justify-between">
								<h1 className="text-md font-bold">
									On The Way
								</h1>
							</div>
							<div className="text-xl font-bold">
								<p className="font-bold text-center">
									{deliveryState &&
										deliveryState.ontheway}
								</p>
							</div>
						</div>
					</div>

					<div className="text-[#637381] flex justify-center items-center gap-5 bg-white p-5 w-[20%] mb-4 shadow-xl rounded-md border border-gray-300/50">
						<div className="p-3 rounded-xl bg-green-400">
							<TbHome2
								size={30}
								className="text-white "
							/>
						</div>
						<div className="relative">
							<div className="flex font-medium justify-between">
								<h1 className="text-md font-bold">
									Delivered
								</h1>
							</div>
							<div className="text-xl font-bold">
								<p className="font-bold text-center">
									{deliveryState &&
										deliveryState.delivered}
								</p>
							</div>
						</div>
					</div>

					<div className="text-[#637381] flex justify-center items-center gap-5 bg-white p-5 w-[20%] mb-4 shadow-xl rounded-md border border-gray-300/50">
						<div className="p-3 rounded-xl bg-yellow-400">
							<RiRefund2Line
								size={30}
								className="text-white "
							/>
						</div>
						<div className="relative">
							<div className="flex font-medium justify-between">
								<h1 className="text-md font-bold">
									Refund
								</h1>
							</div>
							<div className="text-xl font-bold">
								<p className="font-bold text-center">
									{deliveryState &&
										deliveryState.refund}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="rounded-div2 mt-5">
				<h3 className="font-medium text-lg p-2 mb-5">Best Seller</h3>
				<div className="flex justify-center items-center gap-4">
					{bestSeller.slice(0, 5).map((item: any) => {
						return (
							<div
								key={item.productId}
								className="border rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 duration-300">
								<div>
									<Link
										to={`/inventory`}>
										<div className="relative">
											<img
												className="h-full w-full object-contain rounded-t-xl"
												src={
													item.key[0].pictureUrl
												}
												alt={
													item.key[0].name
												}
											/>
										</div>
									</Link>
									<div className="p-4">
										<Link
											to={`/inventory`}>
											<div className="flex justify-between items-center">
												<div className="font-semibold">
													{
														item.key[0].name
													}
												</div>
												<div className="flex justify-center items-center gap-1 ">
													Sold:{" "}
													<span className="flex justify-center items-center text-lg font-bold text-indigo-600">
														{
															item.value
														}
														<FaLongArrowAltUp size={20} className="text-green-500"/>
													</span>
												</div>
											</div>
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className="rounded-div2 mt-5">
				<h3 className="font-medium text-lg p-2 mb-5">Less Interaction</h3>
				<div className="flex justify-center items-center gap-4">
					{lessInteract.map((item: any) => {
						return (
							<div
								key={item.productId}
								className="border rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 duration-300">
								<div>
									<Link
										to={`/inventory`}>
										<div className="relative">
											<img
												className="h-full w-full object-contain rounded-t-xl"
												src={
													item.pictureUrl
												}
												alt={
													item.name
												}
											/>
										</div>
									</Link>
									<div className="p-4">
										<Link
											to={`/inventory`}>
											<div className="flex justify-between items-center">
												<div className="font-semibold">
													{
														item.name
													}
												</div>
												<div className="flex justify-center items-center gap-1">
													view:{" "}
													<span className="flex justify-center items-center text-lg font-bold text-indigo-600">
														{
															item.viewCount
														}
													</span>
												</div>
											</div>
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
			<div className="mt-5">
				<ViewDatePicker />
			</div>
		</>
	);
};

export default AdminHome;
