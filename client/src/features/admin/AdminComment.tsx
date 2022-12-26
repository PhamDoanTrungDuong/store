import { Rating } from "@mui/material";
import React, { useEffect } from "react";
import agent from "../../app/api/agent";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchCommentsAsync, setComLoad } from "./adminSlice";
import CommentSearch from "../../app/components/CommentSearch";
import { AiOutlineHome, AiOutlineComment } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Swal from "sweetalert2";
import { FiTrash2, FiCheckSquare } from "react-icons/fi";
import Loading from "../../app/layout/Loading";
import Tooltip from "@mui/material/Tooltip";
import Zoom from '@mui/material/Zoom';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const AdminComment: React.FC = () => {
	const { comments, loadComment } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();

	useEffect(() => {
		!loadComment ? dispatch(fetchCommentsAsync()) : dispatch(fetchCommentsAsync());
	}, [dispatch, loadComment]);

	function handleDeleteComment(id: number) {
		let response = agent.Admin.deleteComment(id).then(() => {
			dispatch(setComLoad());
		});
		return response;
	}

	function handleApproveComment(id: number) {
		let response = agent.Admin.approveComment(id).then(() => {
			dispatch(setComLoad());
		});
		return response;
	}

	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleDeleteMComment = (id: number) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then((result) => {
			if (result.isConfirmed) {
				handleDeleteComment(id).then(() => {
					Swal.fire(
						"Deleted!",
						"Comment has been deleted.",
						"success"
					);
				});
			}
		});
	};
	const handleApproveMComment = (id: number) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Approve it!",
		}).then((result) => {
			if (result.isConfirmed) {
				handleApproveComment(id).then(() => {
					Swal.fire(
						"Approved!",
						"Comment has been approved.",
						"success"
					);
				});
			}
		});
	};

	if (!comments) return <Loading message="Loading comments..." />;


	return (
		<div className=" mt-24 p-5">
			<div className="flex items-center ml-2 mb-8">
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
						<AiOutlineComment size={20} />
						Comments
					</h1>
				</Link>
			</div>
			<div className="rounded-div2 p-0">
				<div className="flex gap-2 justify-between items-center p-6 mb-5">
					<div className="w-[40%]">
						<CommentSearch />
					</div>
					<div></div>
				</div>
				<div className="p-0">
					<Box sx={{ width: "100%", padding: 0 }}>
						<Box
							sx={{
								borderBottom: 1,
								borderColor: "divider",
							}}>
							<Tabs
								value={value}
								onChange={handleChange}
								aria-label="basic tabs example">
								<Tab
									label="Pending"
									{...a11yProps(0)}
								/>
								<Tab
									label="Approved"
									{...a11yProps(1)}
								/>
							</Tabs>
						</Box>
						<TabPanel value={value} index={0}>
							<div className="h-[600px] overflow-y-scroll">
								<table className="table-auto w-full text-xs sm:text-sm md:text-base">
									<thead>
										<tr className="border-b border-gray-200">
											<td
												className="px-4 py-3"
												align="center">
												#
											</td>
											<td
												className="px-4 py-3"
												align="left">
												Username
											</td>
											<td
												className="px-4 py-3"
												align="left">
												Product
												Name
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Content
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Rating
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Timestampe
											</td>
											<td
												className="px-4 py-3"
												align="left"></td>
										</tr>
									</thead>
									<tbody>
										{comments
											?.filter(
												(
													item
												) =>
													item.isAccept ===
													false
											)
											?.map(
												(
													item: any
												) => {
													return (
														<tr
															className="border-b border-gray-200"
															key={
																item.id
															}>
															<td
																className="py-7"
																align="center">
																{
																	item.id
																}
															</td>
															<td>
																<div className="flex text-lg font-bold">
																	<img
																		src={
																			item?.pictureUrl
																				? item?.pictureUrl
																				: "/images/empty-user.png"
																		}
																		alt={
																			item.username
																		}
																		style={{
																			height: 50,
																			marginRight: 20,
																		}}
																		className="rounded-full"
																	/>
																	<span className="flex items-center capitalize">
																		{
																			item.username
																		}
																	</span>
																</div>
															</td>
															<td>
																<span>
																	{
																		item.productName
																	}
																</span>
															</td>
															<td>
																<span className="flex flex-wrap">
																	{
																		item.content
																	}
																</span>
															</td>
															<td>
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
															</td>
															<td>
																<span>
																	{moment(
																		item.commentSent
																	).format(
																		"MMM Do YY, h:mm a"
																	)}
																</span>
															</td>
															<td className="flex justify-center items-center gap-2 mt-[20%]">
																<button
																	onClick={() =>
																		handleApproveMComment(
																			item.id
																		)
																	}
																	className="p-2 hover:bg-green-300/30 rounded-full duration-200 cursor-pointer">
																		<Tooltip TransitionComponent={Zoom} title="Approve">
																				<FiCheckSquare
																					size={
																						20
																					}
																					className="text-green-600"
																				/>
																		</Tooltip>
																</button>
																<div
																	onClick={() =>
																		handleDeleteMComment(
																			item.id
																		)
																	}
																	className="p-2 hover:bg-red-300/30 rounded-full duration-200 cursor-pointer">
																	<Tooltip TransitionComponent={Zoom} title="Delete">
																		<FiTrash2 size={20} className='text-red-600' />
																	</Tooltip>
																</div>
															</td>
														</tr>
													);
												}
											)}
									</tbody>
								</table>
							</div>
						</TabPanel>
						<TabPanel value={value} index={1}>
							<div className="h-[600px] overflow-y-scroll">
								<table className="table-auto w-full text-xs sm:text-sm md:text-base">
									<thead>
										<tr className="border-b border-gray-200">
											<td
												className="px-4 py-3"
												align="center">
												#
											</td>
											<td
												className="px-4 py-3"
												align="left">
												Username
											</td>
											<td
												className="px-4 py-3"
												align="left">
												Product
												Name
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Content
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Rating
											</td>
											<td
												className="px-4 py-3"
												align="center">
												Timestampe
											</td>
											<td
												className="px-4 py-3"
												align="left"></td>
										</tr>
									</thead>
									<tbody>
										{comments
											?.filter(
												(
													item
												) =>
													item.isAccept ===
													true
											)
											?.map(
												(
													item: any
												) => {
													return (
														<tr
															className="border-b border-gray-200"
															key={
																item.id
															}>
															<td
																className="py-7"
																align="center">
																{
																	item.id
																}
															</td>
															<td>
																<div className="flex text-lg font-bold">
																	<img
																		src={
																			item?.pictureUrl
																				? item?.pictureUrl
																				: "/images/empty-user.png"
																		}
																		alt={
																			item.username
																		}
																		style={{
																			height: 50,
																			marginRight: 20,
																		}}
																		className="rounded-full"
																	/>
																	<span className="flex items-center capitalize">
																		{
																			item.username
																		}
																	</span>
																</div>
															</td>
															<td>
																<span>
																	{
																		item.productName
																	}
																</span>
															</td>
															<td>
																<span className="flex flex-wrap">
																	{
																		item.content
																	}
																</span>
															</td>
															<td>
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
															</td>
															<td>
																<span>
																	{moment(
																		item.commentSent
																	).format(
																		"MMM Do YY, h:mm a"
																	)}
																</span>
															</td>
															<td align="center" className="flex justify-center items-center gap-2 mt-[35%]">
																<div
																	onClick={() =>
																		handleDeleteMComment(
																			item.id
																		)
																	}
																	className="p-2 hover:bg-red-300/30 rounded-full duration-200 cursor-pointer">
																	<Tooltip TransitionComponent={Zoom} title="Delete">
																		<FiTrash2 size={20} className='text-red-600' />
																	</Tooltip>
																</div>
															</td>
														</tr>
													);
												}
											)}
									</tbody>
								</table>
							</div>
						</TabPanel>
					</Box>
				</div>
			</div>
		</div>
	);
};

export default AdminComment;
