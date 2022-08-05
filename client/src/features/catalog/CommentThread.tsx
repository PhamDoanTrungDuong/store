import axios from "axios";
import React, { useEffect, useState } from "react";
import { IComment } from "../../app/interfaces/IComment";
import moment from 'moment';
import { AiOutlineLike } from "react-icons/ai";
import { IoIosReturnLeft } from "react-icons/io";
// import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
// import { fetchCommentAsync } from "./catalogSlice";

interface IProps {
	idProduct?: string;
}

const CommentThread: React.FC<IProps> = ({ idProduct }) => {
      // const { comments } = useAppSelector((state) => state.catalog);
      // const dispatch = useAppDispatch();

	// // const [comments, setComments] = useState<IComment[]>([]);
	// useEffect(() => {
	// 	dispatch(fetchCommentAsync(Number(idProduct)));
	// }, [dispatch]);

      //================================================
	const [comments, setComments] = useState<IComment[]>([]);
	useEffect(() => {
		axios.get(`comment?productId=${Number(idProduct)}`).then((res) => {
			setComments(res.data.items);
		});
	});

      const capitalize = (str: string) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
      }
	return (
		<>
			{comments.map((comment) => {
				return (
                              <div key={comment.id}>
                                    <section className="relative w-full flex items-center justify-center bg-white my-2">
                                          <div className="flex-col w-full py-4 mt-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm">
                                                <div className="flex flex-row">
                                                      <img
                                                            className="w-12 h-12 border-2 border-gray-300 rounded-full"
                                                            alt="Anonymous's avatar"
                                                            src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&faces=1&faceindex=1&facepad=2.5&w=500&h=500&q=80"
                                                      />
                                                      <div className="flex-col mt-1">
                                                            <div className="flex items-center flex-1 px-4 font-bold leading-tight">
                                                                  {capitalize(comment.username)}
                                                                  <span className="ml-2 text-xs font-normal text-gray-500">
                                                                  {moment(comment.commentSent, "YYYYMMDD").startOf('hour').fromNow()}
                                                                  </span>
                                                            </div>
                                                            <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">
                                                                  {comment.content}
                                                            </div>
                                                            <div className="flex items-center">

                                                            <button className="inline-flex items-center px-1 pt-2 ml-1 flex-column">
                                                                  <span className="mx-2" >
                                                                  <IoIosReturnLeft size={20} />
                                                                  </span>
                                                            </button>
                                                            <button className="inline-flex items-center px-1 -ml-1 flex-column">
                                                                  <AiOutlineLike size={20} />
                                                            </button>
                                                            </div>

                                                      </div>
                                                </div>
                                          </div>
                                    </section>
                              </div>

				);
			})}
		</>
	);
};

export default CommentThread;
