import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { RiCouponLine } from "react-icons/ri";
import agent from "../../app/api/agent";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchColor, fetchSize, setColorsLoad } from "./adminSlice";
import Swal from "sweetalert2";
import Loading from "../../app/layout/Loading";
import ColorForm from "./ColorForm";
import SizeForm from "./SizeForm";

const AdminColor = () => {
	const { sizes, loadSizes } = useAppSelector((state) => state.admin);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [selectedSize, setSelectedSize] = useState<any>(undefined);

	const dispatch = useAppDispatch();

	useEffect(() => {
		loadSizes ? dispatch(fetchSize()) : dispatch(fetchSize());
	}, [dispatch, loadSizes]);

	function cancelEdit() {
		if (selectedSize) setSelectedSize(undefined);
		setEditMode(false);
	}

	function handleSelectSize(size: any) {
		setSelectedSize(size);
		setEditMode(true);
	}

	function handleDeleteSize(id: number) {
		let response = agent.Admin.deleteSize(id)
			.then(() => dispatch(setColorsLoad()))
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
				handleDeleteSize(id).then(() => {
					Swal.fire(
						"Deleted!",
						"Size has been deleted.",
						"success"
					);
				});
			}
		});
	};

	if (editMode) return <SizeForm size={selectedSize} cancelEdit={cancelEdit} />;

	if (!sizes) return <Loading message="Loading Sizes..." />;

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
							Sizes
						</h1>
					</Link>
				</div>
				<div>
					<button
						onClick={() => setEditMode(true)}
						className="flex justify-between items-center gap-2 border text-white px-3 py-2 border-indigo-600 bg-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
						<AiOutlinePlus />
						New Size
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
								<td></td>
							</tr>
						</thead>
						<tbody>
							{sizes?.map((size: any, idx: number) => (
								<tr
									className="border-b border-gray-200"
									key={idx}>
									<td
										className="py-7"
										align="center">
										{size.id}
									</td>
									<td align="center">
										{size.size_value}
									</td>
									<td className="flex justify-center items-center gap-2 mt-[5%]">
										<div
											className="p-2 hover:bg-yellow-200/30 rounded-full duration-200 cursor-pointer"
											onClick={() =>
												handleSelectSize(
													size
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
													size.id
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

export default AdminColor;
