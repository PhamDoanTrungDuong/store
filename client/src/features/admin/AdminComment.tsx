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
import React, { useEffect } from "react";
import agent from "../../app/api/agent";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchCommentsAsync, setComLoad } from "./adminSlice";
import CommentSearch from "../../app/components/CommentSearch";
import { AiOutlineHome, AiOutlineComment } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';

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
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AdminComment: React.FC = () => {
	const { comments, loadComment } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();

	useEffect(() => {
		!loadComment ? dispatch(fetchCommentsAsync()) : dispatch(fetchCommentsAsync());
	}, [dispatch, loadComment]);

	function handleDeleteComment(id: number) {
		agent.Admin.deleteComment(id).then(() => {
			dispatch(setComLoad());
		});
	}

	function handleApproveComment(id: number) {
		agent.Admin.approveComment(id).then(() => {
			dispatch(setComLoad());
		});
	}

	const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

	return (
		<div className=" mt-5 p-5">
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
						<AiOutlineComment size={20} />
						Comments
					</h1>
				</Link>
			</div>
			<div className="flex gap-2 justify-between items-center mb-5">
				<div></div>
				<div className="basis-3/4 w-[40%]">
					<CommentSearch />
				</div>
				<div></div>
			</div>
			<div>
			<Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Pending" {...a11yProps(0)} />
          <Tab label="Approved" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
		<div className="h-[600px] overflow-y-scroll">
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left">
									Username
								</TableCell>
								<TableCell align="left">
									Product Name
								</TableCell>
								<TableCell
									align="center"
									size="small">
									Content
								</TableCell>
								<TableCell
									align="center"
									size="small">
									Rating
								</TableCell>
								<TableCell align="center">
									Timestampe
								</TableCell>
								<TableCell align="left"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{comments?.filter((item) => item.isAccept === false)?.map((item: any) => {
								return (
									<TableRow key={item.id}>
										<TableCell>
											{item.id}
										</TableCell>
										<TableCell>
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
										<TableCell className="flex">
											<button
												onClick={() =>
													handleApproveComment(
														item.id
													)
												}
												className={item.isAccept !== true ? "px-4 py-2 mr-2 text-white border border-green-600 font-bold bg-green-600 hover:bg-transparent hover:text-green-600 duration-200 rounded-lg" : "px-4 cursor-default py-2 mr-2 disabled text-white border border-gray-600 font-bold bg-gray-600 opacity-30 duration-200 rounded-lg"}>
												Approve
											</button>
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
      </TabPanel>
      <TabPanel value={value} index={1}>
		<div className="h-[600px] overflow-y-scroll">
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>#</TableCell>
								<TableCell align="left">
									Username
								</TableCell>
								<TableCell align="left">
									Product Name
								</TableCell>
								<TableCell
									align="center"
									size="small">
									Content
								</TableCell>
								<TableCell
									align="center"
									size="small">
									Rating
								</TableCell>
								<TableCell align="center">
									Timestampe
								</TableCell>
								<TableCell align="left"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{comments?.filter((item) => item.isAccept === true)?.map((item: any) => {
								return (
									<TableRow key={item.id}>
										<TableCell>
											{item.id}
										</TableCell>
										<TableCell>
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
										<TableCell className="flex">
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
      </TabPanel>
    </Box>
			</div>
			
		</div>
	);
};

export default AdminComment;
