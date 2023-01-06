import React, { useEffect, useState } from "react";
import { AiTwotoneBell } from "react-icons/ai";
import { fetchOrdersAsync, setOrdLoad } from "../../features/admin/adminSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import moment from "moment";
import agent from "../api/agent";
import { TbGift, TbHome2 } from "react-icons/tb";
import { RiTruckLine } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";

const UserNotifi: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const handleOpen = () => {
		setIsOpen(!isOpen);
	};

	const { orders, loadOrder } = useAppSelector((state) => state.admin);
	const { user } = useAppSelector((state) => state.account);
	const dispatch = useAppDispatch();

	useEffect(() => {
		!loadOrder ? dispatch(fetchOrdersAsync()) : dispatch(fetchOrdersAsync());
	}, [dispatch, loadOrder]);

	function handleDeleteStatus(id: number) {
		agent.Catalog.checkUserNotify(id).then(() => {
			dispatch(setOrdLoad());
		});
	}
	return (
		<>
			<button
				onClick={handleOpen}
				className="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-black dark:text-gray-400"
				type="button">
				<AiTwotoneBell
					className="hover:fill-indigo-600 duration-200"
					size={25}
				/>
				<div
					className={`relative ${
						orders?.find((item) => item.isUserNotifi === true && item.buyerId === user?.username)
							? "flex"
							: "hidden"
					}`}>
					<div className="inline-flex relative -top-2 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></div>
				</div>
			</button>
			{/* <!-- Dropdown menu --> */}
			<div
				onClick={() => setIsOpen(false)}
				className={`${
					!isOpen ? "hidden" : ""
				} w-screen h-screen absolute top-0 left-0`}></div>
			<div
				id="dropdownNotification"
				className={`${
					!isOpen ? "hidden" : ""
				} duration-300 absolute right-96 top-16 text-black w-full max-w-sm bg-white divide-y shadow dark:bg-white divide-indigo-600 rounded-xl h-[500px] overflow-hidden overflow-y-scroll`}>
				<div className="block py-2 px-4 font-medium text-center bg-indigo-600 text-white rounded-t-xl">
					Notifications
				</div>
				<div className="divide-y divide-gray-200">
					{orders
						?.filter((item) => item.isUserNotifi === true && item.buyerId === user?.username)
						.map((status) => {
							// console.log(status)
							return (
								<div
									key={status.id}
									onClick={() =>
										handleDeleteStatus(
											status.id
										)
									}
									className="flex py-3 px-4 hover:bg-gray-200 duration-200 cursor-pointer">
									<div className="flex-shrink-0">
										<img
											className="w-11 h-11 rounded-full"
											src="/images/empty-user.png"
											alt={
												status.deliveryStatus
											}
										/>
										<div className="flex absolute justify-center items-center ml-6 -mt-6 w-7 h-7 bg-white rounded-full border border-white dark:border-gray-800">
											{status.deliveryStatus ===
											"PendingConfirm" ? (
												<div className="flex justify-center items-center">
													<TbGift
														size={
															20
														}
														className="text-indigo-600"
													/>
												</div>
											) : status.deliveryStatus ===
											  "OnTheWay" ? (
												<div className="flex justify-center items-center">
													<RiTruckLine
														size={
															20
														}
														className="fill-red-600"
													/>
												</div>
											) : status.deliveryStatus ===
											  "ProductDelivered" ? (
												<div className="flex justify-center items-center">
													<TbHome2
														size={
															20
														}
														className="text-green-600"
													/>
												</div>
											) : (
												<div className="flex justify-center items-center">
													<MdOutlineCancel
														size={
															20
														}
														className="text-red-600"
													/>
												</div>
											)}
										</div>
									</div>
									<div className="pl-3 w-full">
										<div className="text-gray-800 text-sm mb-1.5 dark:text-gray-400">
											New status
											from{" "}
											<span className="font-semibold text-gray-900">
												System
											</span>
											: "Your
											order with
											ID: #
											<span className="font-semibold">{status.id}</span>"
											has been
											confirmed
											with status:
											<span className="font-semibold text-gray-900">
												"
												{
													status.deliveryStatus
												}
												"
											</span>
										</div>
										<div className="text-xs text-blue-600 dark:text-blue-500">
											{moment(
												status.orderDate,
												"YYYYMMDD"
											)
												.startOf(
													"hour"
												)
												.fromNow()}
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</>
	);
};

export default UserNotifi;
