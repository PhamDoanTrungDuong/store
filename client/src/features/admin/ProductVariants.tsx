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
interface IProps {
	product?: IProduct;
	cancelEdit: () => void;
}

const ProductVariants: React.FC<IProps> = ({ product, cancelEdit }) => {
	const [colors, setColors] = useState([]);
	const [sizes, setSizes] = useState([]);
	const [variants, setVariants] = useState([]);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (product && product.id !== undefined)
			agent.Catalog.getColors()
				.then((res) => setColors(res))
				.catch((error) => console.log(error));
		agent.Catalog.getSizes()
			.then((res) => setSizes(res))
			.catch((error) => console.log(error));
		if (product !== undefined) {
			agent.Catalog.productVariants(product.id)
				.then((res) => setVariants(res))
				.catch((error) => console.log(error));
		}
	}, [product]);

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
						Product Variants
					</h1>
				</Link>
			</div>
			<div>
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
								<td></td>
							</tr>
						</thead>
						<tbody>
							{variants?.map(
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
										<td align="center" className="flex justify-center items-center gap-4 mt-[10%]">
											<div
												className={`bg-${variant.colourValue}-500 border-2 border-gray-300  ml-1 rounded-full w-6 h-6 focus:outline-none`}></div>
											<span className="capitalize">
												{
													variant.colourValue
												}
											</span>
										</td>
										<td align="center">
											<span>
												{
													variant.sizeValue
												}
											</span>
										</td>
										<td align="center">
											{
												variant.quantity
											}
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

export default ProductVariants;
