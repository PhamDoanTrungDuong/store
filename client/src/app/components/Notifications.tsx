import React, { useEffect, useState } from "react";
import { AiTwotoneBell, AiFillHeart } from "react-icons/ai";
import { fetchCommentsAsync, setComLoad } from "../../features/admin/adminSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import moment from "moment";
import agent from "../api/agent";

const Notifications: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const handleOpen = () => {
		setIsOpen(!isOpen);
	};

	const { comments, loadComment } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();
	useEffect(() => {
		!loadComment ? dispatch(fetchCommentsAsync()) : dispatch(fetchCommentsAsync());
	}, [dispatch, loadComment]);

	function handleDeleteComment(id: number) {
		agent.Admin.checkNotifyComment(id).then(() => {
			dispatch(setComLoad());
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
						comments?.find((item) => item.isNoftify === true)
							? "flex"
							: "hidden"
					}`}>
					<div className="animate-ping inline-flex absolute -top-2 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
					<div className="inline-flex relative -top-2 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
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
				} duration-300 absolute right-12 top-16 text-black w-full max-w-sm bg-white divide-y shadow dark:bg-white divide-indigo-600 rounded-xl h-[400px] overflow-hidden overflow-y-scroll`}>
				<div className="block py-2 px-4 font-medium text-center bg-indigo-600 text-white rounded-t-xl">
					Notifications
				</div>
				<div className="divide-y divide-gray-200">
					{comments
						?.filter((item) => item.isNoftify === true)
						.map((comment) => {
							return (
								<div
									key={comment.id}
									onClick={() =>
										handleDeleteComment(
											comment.id
										)
									}
									className="flex py-3 px-4 hover:bg-gray-200 duration-200 cursor-pointer">
									<div className="flex-shrink-0">
										<img
											className="w-11 h-11 rounded-full"
											src={
												comment.pictureUrl ===
												null
													? "/images/empty-user.png"
													: comment.pictureUrl
											}
											alt={
												comment.username
											}
										/>
										<div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-white rounded-full border border-white dark:border-gray-800">
											<AiFillHeart
												size={
													15
												}
												className="fill-red-500"
											/>
										</div>
									</div>
									<div className="pl-3 w-full">
										<div className="text-gray-500 text-sm mb-1.5 dark:text-gray-400">
											New comment
											from{" "}
											<span className="font-semibold text-gray-900">
												{
													comment.username
												}
											</span>
											: "
											{
												comment.content
											}
											" to product{" "}
											{
												comment.productId
											}{" "}
											-{" "}
											{
												comment.productName
											}
										</div>
										<div className="text-xs text-blue-600 dark:text-blue-500">
											{moment(
												comment.commentSent,
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

export default Notifications;
