import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { IProduct } from "../../app/interfaces/IProduct";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { RiBarChartBoxFill } from "react-icons/ri";
import { currencyFormat } from "../../app/utilities/util";

interface IProps {
	receipt?: any;
	cancelEdit: () => void;
}

const ReceiptDetails: React.FC<IProps> = ({ receipt, cancelEdit }) => {
	console.log(receipt);

	return (
		<div className="mt-24 p-5 rounded-div2">
			<div className="flex items-center ml-2 mt-4 mb-8">
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
						<RiBarChartBoxFill size={20} />
						Receipt Details
					</h1>
				</Link>
			</div>
			<div>
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
									Product Id
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Color
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Size
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Quantity
								</td>
								<td
									className="px-4 py-3"
									align="center">
									Price
								</td>
								<td></td>
							</tr>
						</thead>
						<tbody>
							{receipt.receiptDetails?.map(
								(variant: any, idx: number) => (
									<tr
										className="border-b border-gray-200"
										key={idx}>
										<td
											className="py-7"
											align="center">
											{variant.id}
										</td>
										<td align="center">
											{
												variant.productId
											}
										</td>
										<td
											align="center"
											className="flex justify-center items-center gap-4 mt-[10%]">
												{variant.color && 
													<div
														className={`bg-${variant.color}-500 border-2 border-gray-300  ml-1 rounded-full w-6 h-6 focus:outline-none`}></div>
												}
											<span className="capitalize">
												{
													variant.color
												}
											</span>
										</td>
										<td align="center">
											<span>
												{
													variant.size
												}
											</span>
										</td>
										<td align="center">
											{
												variant.quantity
											}
										</td>
										<td align="center">
											{currencyFormat(
												variant.price
											)}
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>
			</div>
			<div>
				<Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
					<Button
						onClick={cancelEdit}
						variant="contained"
						color="inherit">
						Cancel
					</Button>
				</Box>
			</div>
		</div>
	);
};

export default ReceiptDetails;
