// @ts-nocheck
import React, { useEffect, useState } from "react";
import ReceiptEditDetail from "./ReceiptEditDetail";
import AppTextInputReceipt from "./AppTextInputReceipt";
import AppSelectList from "./AppSelectList";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldValues, useForm } from "react-hook-form";
import { receiptValidation } from "../../features/admin/receiptValidation";
import { fetchPartners } from "../../features/admin/adminSlice";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import agent from "../api/agent";

interface IProps {
	data: any;
	cancelEditItems: () => void;
	cancelEdit: () => void;
}

const ReceiptEditTable: React.FC<IProps> = ({ data, cancelEditItems, cancelEdit }) => {
	const { partners, loadPartner } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();

	
	const {
		control,
		reset,
		register,
		handleSubmit,
		watch,
		formState: { isDirty, isSubmitting },
	} = useForm({
		defaultValues: {
			update: [],
		},
		// mode: 'all',
		// resolver: yupResolver<any>(receiptValidation)
	});

	useEffect(() => {
		loadPartner ? dispatch(fetchPartners()) : dispatch(fetchPartners());
	}, [dispatch, loadPartner]);
	const namesArray = partners && partners.map((item: any) => item.name);

	async function handleSubmitData(data: any) {
		let flatData = data.update.flat()
		console.log(flatData)
		var dataUpdate = {update: flatData, partner: data.partner}
		try {
			var result = agent.Admin.newReceipt(dataUpdate)
									.then(() => cancelEdit())
									.then(() => setReceiptLoad())
			return result
			//  cancelEdit();
		} catch (error) {
			 console.log(error)
		}
	}

	return (
		<div>
			<form onSubmit={handleSubmit(handleSubmitData)}>
				<div className="flex justify-between p-6 items-center">
					<div className="w-[30%]">
						<AppSelectList items={namesArray} control={control} name='partner' label='Partners' />
					</div>
					<div className="flex justify-between items-center gap-2">
						<button
							onClick={() => cancelEditItems()}
							className="flex justify-between items-center gap-2 border text-gray-600 px-3 py-2 border-gray-600 bg-white rounded-lg hover:text-white hover:bg-gray-600 duration-200 ease-in-out ">
							Cancel
						</button>
						<button
							type="submit"
							// onClick={() => setEditItems(true)}
							className="flex justify-between items-center gap-2 border text-white px-3 py-2 border-indigo-600 bg-indigo-600 rounded-lg hover:text-indigo-600 hover:bg-transparent duration-200 ease-in-out ">
							Submit
						</button>
					</div>
				</div>
				<table className="table-auto w-full bg-white  overflow-hidden">
					<thead className="text-gray-700">
						<tr>
							<th className="px-4 py-2 text-left"></th>
							<th className="px-4 py-2 text-left">
								Product Name
							</th>
							<th className="px-4 py-2">Import Number</th>
							<th className="px-4 py-2">Price</th>
							<th className="px-4 py-2">Quantity</th>
							<th className="px-4 py-2">Total Money</th>
						</tr>
					</thead>
					<tbody className="text-gray-600">
						{data.map((product: any, idx: number) => (
							<React.Fragment key={product.productId}>
								<tr>
									<td className="px-4 py-2"></td>
									<td className="px-4 py-2 flex items-center gap-4">
										<img
											src={
												product.pictureUrl
											}
											alt={
												product.name
											}
											style={{
												height: 80,
												marginRight: 20,
												borderRadius: 10,
											}}
										/>
										<span className="text-medium font-medium">
											{
												product.name
											}
										</span>
									</td>
									{
										product
										.productDetails
										.length ===
										0 && (<input
											type="hidden"
											{...register(
												`update[${idx}].productId`
											)}
											value={
												product.productId
											}
										/>)
									}
									<td className="px-4 py-2">
										{product
											.productDetails
											.length ===
											0 && (
											<AppTextInputReceipt
												control={
													control
												}
												name={`update[${idx}].quantity`}
												label=""
											/>
										)}
									</td>
									<td className="px-4 py-2 text-center text-medium font-medium">
										{product
											.productDetails
											.length ===
											0 && (
											<AppTextInputReceipt
												control={
													control
												}
												name={`update[${idx}].price`}
												label=""
											/>
										)}
									</td>
									<td className="px-4 py-2 text-center text-medium font-medium">
										{product.quantity}
									</td>
									<td className="px-4 py-2 text-center text-medium font-medium">
										{product.quantity}
									</td>
								</tr>
								{product.productDetails &&
									product.productDetails
										.length > 0 && (
										<tr className="border-b border-gray-200">
											<td></td>
											<td col-span="2">
												{/* <ReceiptEditDetail
													data={
														product.productDetails
													}
													control={control}
													register={register}
													defaultValues={update}
												/> */}
												<table className="min-w-[60%] ml-10 overflow-hidden">
													<thead className=" text-gray-700">
														<tr>
															<th className="px-4 py-2 text-left"></th>
															<th className="px-4 py-2">
																Color
															</th>
															<th className="px-4 py-2">
																Size
															</th>
															<th className="px-4 py-2">
																Quantity
															</th>
															<th className="px-4 py-2">
																Import
																Number
															</th>
															<th className="px-4 py-2">
																Price
															</th>
														</tr>
													</thead>
													<tbody className="text-gray-600">
														{product.productDetails.map(
															(
																detail: any,
																index: number
															) => (
																<tr
																	key={
																		detail.id
																	}>
																	<td className="px-4 py-2 text-center"></td>
																	<td className="px-4 py-2 text-center">
																		{
																			detail.colorsValue
																		}
																	</td>
																	<td className="px-4 py-2 text-center">
																		{
																			detail.sizesValue
																		}
																	</td>
																	<td className="px-4 py-2 text-center">
																		{
																			detail.quantity
																		}
																	</td>
																	<input
																		type="hidden"
																		{...register(
																			`update[${idx}][${index}].color`
																		)}
																		value={
																			detail.colorsValue
																		}
																	/>
																	<input
																		type="hidden"
																		{...register(
																			`update[${idx}][${index}].size`
																		)}
																		value={
																			detail.sizesValue
																		}
																	/>
																	<input
																		type="hidden"
																		{...register(
																			`update[${idx}][${index}].childrenId`
																		)}
																		value={
																			detail.id
																		}
																	/>
																	<input
																		type="hidden"
																		{...register(
																			`update[${idx}][${index}].productId`
																		)}
																		value={
																			detail.parentProductId
																		}
																	/>
																	<td className="px-4 py-2 text-center">
																		<AppTextInputReceipt
																			control={
																				control
																			}
																			name={`update[${idx}][${index}].quantity`}
																			label=""
																		/>
																	</td>
																	<td className="px-4 py-2 text-center">
																		<AppTextInputReceipt
																			control={
																				control
																			}
																			name={`update[${idx}][${index}].price`}
																			label=""
																		/>
																	</td>
																</tr>
															)
														)}
													</tbody>
												</table>
											</td>
										</tr>
									)}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</form>
		</div>
	);
};

export default ReceiptEditTable;
