import React, { useEffect, useState } from "react";
import { IComment } from "../../app/interfaces/IComment";
import moment from "moment";
import { AiOutlineLike } from "react-icons/ai";
import { IoIosReturnLeft } from "react-icons/io";
import agent from "../../app/api/agent";
import { Rating } from "@mui/material";
// import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
// import { fetchCommentAsync } from "./catalogSlice";

interface IProps {
	idProduct?: string;
}

const CommentThread: React.FC<IProps> = ({ idProduct }) => {
	//================================================
	const [comments, setComments] = useState<IComment[]>([]);
	useEffect(() => {
		if (idProduct !== undefined)
			agent.Comment.getComment(Number(idProduct))
				.then((res) => setComments(res.items))
				.catch((error) => console.log(error));
		// console.log("[commentthread]: ", comments);
	}, [comments, idProduct]);

	const capitalize = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	return (
		<div className={comments.length !== 0 ? "h-[500px]" : ""}>
			{comments.map((comment) => {
				return (
					<div key={comment.id}>
						<section className="relative w-full flex items-center justify-center bg-white my-2">
							<div className="flex-col w-full py-4 mt-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm">
								<div className="flex flex-row">
									<img
										className="w-12 h-12 border-2 border-gray-300 rounded-full"
										src={
											comment?.pictureUrl
												? comment?.pictureUrl
												: "/images/empty-user.png"
										}
										alt={comment?.username}
									/>
									<div className="flex-col mt-1">
										<div className="flex justify-start items-center px-4 font-bold leading-tight">
											{capitalize(
												comment.username
											)}
											<span className="ml-2 text-xs font-normal text-gray-500 mr-5">
												{moment(
													comment.commentSent,
													"YYYYMMDD"
												)
													.startOf(
														"hour"
													)
													.fromNow()}
											</span>
											<div>
												{comment.rate !==
													0 && (
													<Rating
														name="read-only"
														size="small"
														readOnly
														value={
															comment.rate
														}
													/>
												)}
											</div>
										</div>
										<div className="flex px-2 ml-2 text-sm font-medium leading-loose text-gray-600 ">
											<span className="whitespace-pre-wrap">
												{
													comment.content
												}
											</span>
										</div>
										<div className="flex items-center">
											<button className="inline-flex items-center px-1 pt-2 ml-1 flex-column">
												<span className="mx-2">
													<IoIosReturnLeft
														size={
															20
														}
													/>
												</span>
											</button>
											<button className="inline-flex items-center px-1 -ml-1 flex-column">
												<AiOutlineLike
													size={
														20
													}
												/>
											</button>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
				);
			})}
		</div>
	);
};

export default CommentThread;
