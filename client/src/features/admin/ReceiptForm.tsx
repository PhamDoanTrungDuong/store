import { Box, TextField, Tooltip, Typography, Zoom } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import { ICategory } from "../../app/interfaces/ICategory";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductDetails, setCateLoad } from "./adminSlice";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiOutlinePlus } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import CategorySearch from "../../app/components/CategorySearch";
import ProductCheckboxTable from "../../app/components/ProductCheckboxTable";
import ReceiptEdit from "./ReceiptEdit";
interface Props {
	cancelEdit: () => void;
}

const ReceiptForm: React.FC<Props> = ({ cancelEdit }) => {
	const [editItems, setEditItems] = useState(false);

	const { productDetails, loadProductDetails } = useAppSelector((state) => state.admin);
	const [selectedItems, setSelectedItems] = useState();
	const [childrenItems, setChildrenItems] = useState();
	const [parentItems, setParentItems] = useState();

	function cancelEditItems() {
		// if (selectedReceipt) setSelectedReceipt(undefined);
		setEditItems(false);
	}

	const handleSelectedItems = (selectedItems: any, childrenItems: any, parentItems: any) => {
		// Perform your action here with selectedItems
		setSelectedItems(selectedItems);
		setChildrenItems(childrenItems);
		setParentItems(parentItems);
	 };

	type FormData = {
		name: string;
	};
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<FormData>({
		mode: "all",
	});

	const dispatch = useAppDispatch();

	useEffect(() => {
		!loadProductDetails ? dispatch(fetchProductDetails()) : dispatch(fetchProductDetails());
	}, [dispatch, loadProductDetails])

	async function handleSubmitData(data: any) {
		try {
			await agent.Admin.createCategory(data);
			dispatch(setCateLoad());
			cancelEdit();
		} catch (error) {
			console.log(error);
		}
	}
	if (editItems) return <ReceiptEdit cancelEditItems={cancelEditItems} childrenItems={childrenItems} parentItems={parentItems} cancelEdit={cancelEdit} />;

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
				</div>
			</div>
			<div className="rounded-div2 p-0">
				<div className="flex justify-between p-6 items-center">
					<div className="w-[30%]">
						<CategorySearch />
					</div>
					<div className="flex justify-between items-center gap-10">
						<p className="text-lg font-bold text-indigo-500">{selectedItems} items have been selected</p>
						<div className="flex justify-between items-center gap-2">
							<button
								onClick={() => cancelEdit()}
								className="flex justify-between items-center gap-2 border text-gray-600 px-3 py-2 border-gray-600 bg-white rounded-lg hover:text-white hover:bg-gray-600 duration-200 ease-in-out ">
								Cancel
							</button>
							<button
								onClick={() => setEditItems(true)}
								className="flex justify-between items-center gap-2 border text-white px-3 py-2 border-indigo-600 bg-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
								Select
							</button>
						</div>
					</div>
				</div>
				<div className="h-[600px] overflow-y-scroll">
						<ProductCheckboxTable data={productDetails} onSelectedItemsChange={handleSelectedItems} />
				</div>
			</div>
		</div>
	);
};

export default ReceiptForm;
