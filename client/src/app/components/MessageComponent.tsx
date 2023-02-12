import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import agent from "../api/agent";
import { useAppSelector } from "../store/configureStore";
import { useForm } from "react-hook-form";

const MessageComponent = () => {
	const { user } = useAppSelector((state) => state.account);

	const { register, handleSubmit, reset } = useForm();
	const [open, setOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [messages, setMessages] = useState([]);
	const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
		if (open) {
			loading ?
          agent.Message.messageThread("admin").then((res) => {
              setMessages(res);
          })
        :
          agent.Message.messageThread("admin").then((res) => {
              setMessages(res);
          })
		}
    setLoading(false);
	}, [loading, open]);
	useEffect(() => {
		if(loading === false){
      agent.Message.unreadMessage("admin").then((res) => {
					setUnreadMessages(res);
			})
    }
	}, [loading]);

	const handleOpen = () => {
    setLoading(true)
		setOpen(!open);
	};
	const onSubmit = (data: any) => {
		var recipientUsername = "admin";
		data = { ...data, recipientUsername };
		agent.Message.messageSend(data).then((res) => {
			reset({
				content: "",
			});
			setLoading(!loading);
		});
	};

	return (
		<>
			<Tooltip TransitionComponent={Zoom} title="Chat With Admin">
				<div
					className="relative w-20 h-20 rounded-full shadow shadow-slate-400 flex justify-center items-center cursor-pointer z-50"
					onClick={handleOpen}>
					<img
						src="/images/fb-messenger.png"
						className="w-[80%] h-[80%] object-fit"
						alt=""
					/>
					<div className="absolute top-0 right-0">
						<div
							className={`relative ${
								unreadMessages &&
								unreadMessages?.find(
									(item: any) =>
										item.dateRead ===
										null
								)
									? "flex"
									: "hidden"
							}`}>
							<div className="animate-ping inline-flex absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
							<div className="inline-flex relative top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
						</div>
					</div>
				</div>
			</Tooltip>

			{open ? (
				<>
					<div
						className="h-screen w-screen z-0 fixed right-0 bottom-0"
						onClick={handleOpen}></div>
					<div className="fixed right-8 bottom-32 w-[400px] h-[600px] rounded-xl border border-slate-400 duration-200">
						<div className="container mx-auto">
							<div className="max-w-2xl border rounded-xl bg-white">
								<div>
									<div className="w-full">
										{/* Header */}
										<div className="relative flex items-center p-3 border-b border-gray-300">
											<img
												className="object-cover w-10 h-10 rounded-full"
												src="images/admin.jpg"
												alt="username"
											/>
											<span className="block ml-2 font-bold text-gray-600">
												Administrator
											</span>
											<span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
										</div>
										{/* Chatbox */}
										<div className="relative w-full p-6 overflow-y-auto h-[465px]">
											<ul className="space-y-2">
												{messages &&
													messages.map(
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
																	"admin" ? (
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
										{/* Inute Bar */}
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
							</div>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</>
	);
};

export default MessageComponent;
