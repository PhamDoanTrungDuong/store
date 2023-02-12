import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { SiGooglecolab } from "react-icons/si";
import useMembers from "../../app/hooks/useMembers";
import agent from "../../app/api/agent";
import { useAppSelector } from "../../app/store/configureStore";
import { useForm } from "react-hook-form";

const AdminMessenger = () => {
	const { members } = useMembers();
	const { user } = useAppSelector((state) => state.account);
	const { register, handleSubmit, reset } = useForm();

	const [loading, setLoading] = useState<boolean>(false);
	const [userThread, setUserThread] = useState<any>();
	const [messagesThread, setMessagesThread] = useState([]);
	const [unreadMessages, setUnreadMessages] = useState([]);
	console.log(unreadMessages)
	useEffect(() => {
		if (userThread !== undefined) {
			loading
				? agent.Message.messageThread(userThread.userName).then((res) => {
						setMessagesThread(res);
						agent.Message.unreadMessage("admin").then((res) => {
							setUnreadMessages(res);
						})
				  })
				: agent.Message.messageThread(userThread.userName).then((res) => {
						setMessagesThread(res);
						agent.Message.unreadMessage("admin").then((res) => {
							setUnreadMessages(res);
						})
				  });
		}
	}, [loading, userThread]);

	useEffect(() => {
		if(userThread === undefined){
			agent.Message.unreadMessage("admin").then((res) => {
				setUnreadMessages(res);
			})
		}
	}, [userThread]);

	const onSubmit = (data: any) => {
		if(userThread !== undefined){
			var recipientUsername = userThread.userName;
			data = { ...data, recipientUsername };
			agent.Message.messageSend(data).then((res) => {
				reset({
					content: "",
				});
				setLoading(!loading);
			});
		}
	};

	// if (!partners) return <Loading message="Loading partner..." />;

	return (
		<div className="mt-24 p-5">
			<div className="flex justify-between items-center mb-8">
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
							<SiGooglecolab size={20} />
							Messenger
						</h1>
					</Link>
				</div>
			</div>
			<div className="rounded-div2 p-0">
				<div className="container mx-auto">
					<div className="min-w-full border rounded lg:grid lg:grid-cols-3">
						<div className="border-r border-gray-300 lg:col-span-1">
							<div className="mx-3 my-3">
								<div className="relative text-gray-600">
									<span className="absolute inset-y-0 left-0 flex items-center pl-2">
										<svg
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											viewBox="0 0 24 24"
											className="w-6 h-6 text-gray-300">
											<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
										</svg>
									</span>
									<input
										type="search"
										className="block w-full py-2 pl-10 bg-gray-100 rounded outline-none"
										name="search"
										placeholder="Search"
										required
									/>
								</div>
							</div>

							<ul className="overflow-hidden h-[32rem]">
								<h2 className="my-2 mb-2 ml-2 text-lg text-gray-600">
									Chats
								</h2>
								{members &&
									members
										.filter(
											(
												user: any
											) =>
												user.userName !==
												"admin"
										)
										.map(
											(
												user: any,
												idx
											) => {
												return (
													<li>
														<div
															onClick={() => {
																	setUserThread(
																		user
																	)
																	setLoading(true)
																}
															}
															className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none relative">
															<img
																className="object-cover w-10 h-10 rounded-full"
																src={
																	user.pictureUrl
																		? user.pictureUrl
																		: "/images/empty-user.png"
																}
																alt={
																	user.userName
																}
															/>
															<div className="w-full pb-2">
																<div className="flex justify-between">
																	<span className="block ml-2 font-semibold text-gray-600">
																		{
																			user.userName
																		}
																	</span>
																	<span className="block ml-2 text-sm text-gray-600">
																		6
																		hour
																	</span>
																</div>
																<span className="block ml-2 text-sm text-gray-600">
																	Good
																	Morning
																</span>
															</div>
															<div className="absolute top-2 left-2">
															<div
																className={`relative ${
																	unreadMessages &&
																	unreadMessages?.find(
																		(item: any) =>
																			item.dateRead ===
																			null && item.senderUsername === user.userName
																	)
																		? "flex"
																		: "hidden"
																}`}>
																<div className="animate-ping inline-flex absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
																<div className="inline-flex relative top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
															</div>
														</div>
														</div>
													</li>
												);
											}
										)}
							</ul>
						</div>
						{userThread !== undefined ? (
						<div className="hidden lg:col-span-2 lg:block">
							<div className="w-full">
								<div className="relative flex items-center p-3 border-b border-gray-300">
									<img
										className="object-cover w-10 h-10 rounded-full"
										src={userThread.pictureUrl
											? userThread.pictureUrl
											: "/images/empty-user.png"}
										alt={userThread.userName}
									/>
									<span className="block ml-2 font-bold text-gray-600">
										{userThread.userName}
									</span>
									<span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
								</div>
								<div className="relative w-full p-6 overflow-y-auto h-[30rem]">
									<ul className="space-y-2">
										{messagesThread &&
											messagesThread.map(
												(
													mess: any,
													idx
												) => {
													return (
														<>
															{mess.recipientUsername ===
															user?.username ? (
																<li className="flex justify-start">
																	<div className="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
																		<span className="block">
																			{
																				mess.content
																			}
																		</span>
																	</div>
																</li>
															) : (
																<>

																</>
															)}
															{mess.recipientUsername ===
															userThread.userName ? (
																<li className="flex justify-end">
																	<div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
																		<span className="block">
																			{
																				mess.content
																			}
																		</span>
																	</div>
																</li>
															) : (
																<>

																</>
															)}
														</>
													);
												}
											)}
									</ul>
								</div>

								<form
									onSubmit={handleSubmit(
										onSubmit
									)}>
									<div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
										<button>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-6 h-6 text-gray-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
										</button>
										<button>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-5 h-5 text-gray-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
												/>
											</svg>
										</button>

										<input
											type="text"
											placeholder="Message"
											{...register(
												"content"
											)}
											className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
											name="content"
											required
										/>
										<button>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-5 h-5 text-gray-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
												/>
											</svg>
										</button>
										<button type="submit">
											<svg
												className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor">
												<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
											</svg>
										</button>
									</div>
								</form>
							</div>
						</div>
						) : (
							<div className="hidden lg:col-span-2 lg:block">
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminMessenger;
