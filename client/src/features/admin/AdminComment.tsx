import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Rating,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import moment from "moment";
import { IComment } from "../../app/interfaces/IComment";

const AdminComment: React.FC = () => {
	const [comments, setComments] = useState<IComment[]>([]);
	useEffect(() => {
		agent.Admin.getComments()
			.then((res) => setComments(res))
			.catch((error) => console.log(error));
	});

	function handleDeleteComment(id: number) {
		agent.Admin.deleteComment(id);
	}
	return (
		<div className=" mt-5 p-5">
			<h4 className="text-2xl font-bold my-4">Comments</h4>
			<div className="h-[600px] overflow-y-scroll">
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left">Username</TableCell>
								<TableCell align="left">
									Product Name
								</TableCell>
								<TableCell align="center" size="small">
									Content
								</TableCell>
								<TableCell align="center" size="small">
									Rating
								</TableCell>
								<TableCell align="center">
									Timestampe
								</TableCell>
								<TableCell align="left">Delete</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{comments?.map((item: any) => {
								return (
									<TableRow key={item.id}>
										<TableCell>
											{item.id}
										</TableCell>
										<TableCell>
											<span>
												{
													item.username
												}
											</span>
										</TableCell>
										<TableCell>
											<span>
												{
													item.productName
												}
											</span>
										</TableCell>
										<TableCell size="small">
											<span className="flex flex-wrap">
												{
													item.content
												}
											</span>
										</TableCell>
										<TableCell>
											{item.rate !==
												0 && (
												<Rating
													name="read-only"
													readOnly
													value={
														item.rate
													}
												/>
											)}
										</TableCell>
										<TableCell>
											<span>
												{moment(
													item.commentSent
												).format(
													"MMMM Do YYYY, h:mm:ss a"
												)}
											</span>
										</TableCell>
										<TableCell>
											<button
												onClick={() =>
													handleDeleteComment(
														item.id
													)
												}
												className="px-4 py-2 text-white border border-red-600 font-bold bg-red-600 hover:bg-transparent hover:text-red-600 duration-200 rounded-lg">
												Delete
											</button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default AdminComment;
