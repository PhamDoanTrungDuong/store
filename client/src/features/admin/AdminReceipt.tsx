import React, { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";
import agent from "../../app/api/agent";
import CategorySearch from "../../app/components/CategorySearch";
import { ICategory } from "../../app/interfaces/ICategory";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchCategories, fetchReceipts, setCateLoad } from "./adminSlice";
import ReceiptForm from "./ReceiptForm";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FiTrash2, FiEye } from "react-icons/fi";
import Loading from "../../app/layout/Loading";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import moment from "moment";
import { currencyFormat } from "../../app/utilities/util";
import ReceiptDetails from "./ReceiptDetails";


const AdminReceipt: React.FC = () => {
	const { receipts, loadReceipt } = useAppSelector((state) => state.admin);
	console.log(receipts);
	const [editMode, setEditMode] = useState(false);
	const [selectedReceipt, setSelectedReceipt] = useState<ICategory | undefined>(undefined);
	const [detailMode, setDetailMode] = useState(false);
	const [selectedReceiptDetail, setSelectedReceiptDetail] = useState(undefined);
	const dispatch = useAppDispatch();

	useEffect(() => {
		!loadReceipt ? dispatch(fetchReceipts()) : dispatch(fetchReceipts());
	}, [dispatch, loadReceipt]);

	function handleReceiptDetails(receipt: any) {
		setSelectedReceiptDetail(receipt);
		setDetailMode(true);
	}

	function cancelEdit() {
		if (selectedReceipt) setSelectedReceipt(undefined);
		setEditMode(false);
		setDetailMode(false);

	}

	if (editMode) return <ReceiptForm cancelEdit={cancelEdit} />;
	if (detailMode) return <ReceiptDetails receipt={selectedReceiptDetail} cancelEdit={cancelEdit} />;

	if (!receipts) return <Loading message="Loading receipts" />;

	// const handleDeleteCate = (id: number) => {
	// 	Swal.fire({
	// 		title: 'Are you sure?',
	// 		text: "You won't be able to revert this!",
	// 		icon: 'warning',
	// 		showCancelButton: true,
	// 		confirmButtonColor: '#3085d6',
	// 		cancelButtonColor: '#d33',
	// 		confirmButtonText: 'Yes, delete it!'
	// 	 }).then((result) => {
	// 		if (result.isConfirmed) {
	// 			handleDeleteReceipt(id).then(() => {
	// 				Swal.fire(
	// 				  'Deleted!',
	// 				  'Category been deleted.',
	// 				  'success'
	// 				)
	// 			})
	// 		}
	// 	 })
	// }

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
							<BiCategoryAlt size={20} />
							Receipt
						</h1>
					</Link>
				</div>
				<div>
					<button
						onClick={() => setEditMode(true)}
						className="flex justify-between items-center gap-2 border text-white px-3 py-2 border-indigo-600 bg-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
						<AiOutlinePlus />
						New Receipt
					</button>
				</div>
			</div>
			<div className="rounded-div2 p-0">
				<div className="flex justify-between p-6 items-center">
					<div className="w-[30%]">
						{/* <CategorySearch /> */}
					</div>
					<div></div>
				</div>
				<div className="h-[600px] overflow-y-scroll">
					<table className="table-auto w-full text-xs sm:text-sm md:text-base">
						<thead>
							<tr className="border-b border-gray-200">
								<td
									className="px-4 py-3"
									align="center">
									Id
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Date Create
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Partner
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Status
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Total
								</td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							{receipts?.map((receipt: any, idx) => (
								<tr
									className="border-b border-gray-200"
									key={idx}>
									<td
										className="py-7"
										align="center">
										{receipt.id}
									</td>
									<td align="center">
										<span>
											{moment(
												receipt.dateCreate
											).format(
												"MMM Do YY, h:mm a"
											)}
										</span>
									</td>
									<td align="center">
										<span>
											{
												receipt.partner
											}
										</span>
									</td>
									<td align="center">
										<span>
											{
												receipt.status
											}
										</span>
									</td>
									<td align="center">
										<span>
											{currencyFormat(
												receipt.total
											)}
										</span>
									</td>
									<td
										align="right"
										className="flex justify-center items-center gap-2 mt-[20%]">
										<div
											className="p-2 hover:bg-green-300/30 rounded-full duration-200 cursor-pointer"
											onClick={() =>
												handleReceiptDetails(
													receipt
												)
											}
											>
											<Tooltip
												TransitionComponent={
													Zoom
												}
												title="Details">
												<FiEye
													className="text-green-600"
													size={
														20
													}
												/>
											</Tooltip>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AdminReceipt;
