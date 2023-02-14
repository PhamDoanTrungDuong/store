import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { RiCouponLine } from "react-icons/ri";
import agent from "../../app/api/agent";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchSliders, fetchVouchers, setSliderLoad, setVoucherLoad } from "./adminSlice";
import SliderForm from "./SliderForm";
import Swal from "sweetalert2";
import Loading from "../../app/layout/Loading";
import VoucherForm from "./VoucherForm";

const AdminVo = () => {
	const { vouchers, loadVoucher } = useAppSelector((state) => state.admin);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [selectedVoucher, setSelectedVoucher] = useState<any>(undefined);

	const dispatch = useAppDispatch();

	useEffect(() => {
		loadVoucher ? dispatch(fetchVouchers()) : dispatch(fetchVouchers());
	}, [dispatch, loadVoucher]);

	function cancelEdit() {
		if (selectedVoucher) setSelectedVoucher(undefined);
		setEditMode(false);
	}

	function handleSelectVoucher(slider: any) {
		setSelectedVoucher(slider);
		setEditMode(true);
	}

	function handleDeleteVoucher(id: number) {
		let response = agent.Admin.deleteVoucher(id)
			.then(() => dispatch(setVoucherLoad()))
			.catch((error: any) => console.log(error));
		return response;
	}

	const handleDelete = (id: number) => {
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
				handleDeleteVoucher(id).then(() => {
					Swal.fire(
						"Deleted!",
						"Voucher has been deleted.",
						"success"
					);
				});
			}
		});
	};

	if (editMode) return <VoucherForm voucher={selectedVoucher} cancelEdit={cancelEdit} />;

	if (!vouchers) return <Loading message="Loading vouchers..." />;

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
							<RiCouponLine size={20} />
							Vouchers
						</h1>
					</Link>
				</div>
				<div>
					<button
						onClick={() => setEditMode(true)}
						className="flex justify-between items-center gap-2 border text-white px-3 py-2 border-indigo-600 bg-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
						<AiOutlinePlus />
						New Voucher
					</button>
				</div>
			</div>
			<div className="rounded-div2 p-0">
				<div className="flex justify-between p-6 items-center">
					<div className="w-[30%]">{/* <CategorySearch /> */}</div>
					<div></div>
				</div>
				<div className="h-[400px] overflow-y-scroll">
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
									Name
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Code
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Value
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Feature
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Create Date
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Exspire Date
								</td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							{vouchers?.map((voucher: any, idx: number) => (
								<tr
									className="border-b border-gray-200"
									key={idx}>
									<td
										className="py-7"
										align="center">
										{voucher.id}
									</td>
									<td align="center">
										{voucher.name}
									</td>
									<td align="center">
										<span>
											{
												voucher.code
											}
										</span>
									</td>
									<td align="center">
										<span>
											{
												voucher.value
											}
										</span>
									</td>
									<td align="center">
										<span>
											{
												voucher.feature === 0 ? "Percent %" : voucher.feature === 1 ? "FreeShip" : voucher.feature === 2 ? "Money $" : ""
											}
										</span>
									</td>
									<td align="center">
										<span>
											{moment(
												voucher.createAt
											).format(
												"lll"
											)}
										</span>
									</td>
									<td align="center">
										<span>
											{moment(
												voucher.exspire
											).format(
												"lll"
											)}
										</span>
									</td>
									<td className="flex justify-center items-center gap-2 mt-[20%]">
										<div
											className="p-2 hover:bg-yellow-200/30 rounded-full duration-200 cursor-pointer"
											onClick={() =>
												handleSelectVoucher(
													voucher
												)
											}>
											<Tooltip
												TransitionComponent={
													Zoom
												}
												title="Edit">
												<FiEdit3
													size={
														20
													}
													className="text-yellow-500"
												/>
											</Tooltip>
										</div>
										<div
											className="p-2 hover:bg-red-300/30 rounded-full duration-200 cursor-pointer"
											onClick={() =>
												handleDelete(
													voucher.id
												)
											}>
											<Tooltip
												TransitionComponent={
													Zoom
												}
												title="Delete">
												<FiTrash2
													size={
														20
													}
													className="text-red-600"
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

export default AdminVo;
