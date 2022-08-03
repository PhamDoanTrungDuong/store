import { Grid } from "@mui/material";
import React from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButton from "../../app/components/CheckboxButton";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import useProducts from "../../app/hooks/useProducts";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setPageNumber, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions = [
	{ value: "name", label: "Alphabetical" },
	{ value: "priceDesc", label: "Hight to low" },
	{ value: "price", label: "Low to hight" },
];

const Catalog: React.FC = () => {

	const { products, filtersLoaded, brands, types, pagination } =
	useProducts();

	const { productParams } = useAppSelector((state) => state.catalog);

	const dispatch = useAppDispatch();

	if (!filtersLoaded) return <Loading message="Loading Catalog..." />;


	return (
		<div className="rounded-div mt-5">
			<Grid container columnSpacing={4} sx={{ mb: 4, mt: 4 }}>
				<Grid item xs={2}>
					<div className="mb-4">
						<ProductSearch />
					</div>

					<div className="mb-4">
						<div className="flex text-darkred">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
								/>
							</svg>
							<h4 className="ml-[3px] font-medium">
								Sort Order
							</h4>
						</div>
						<RadioButtonGroup
							selectedValue={
								productParams.orderBy
							}
							options={sortOptions}
							onChange={(e) =>
								dispatch(
									setProductParams(
										{
											orderBy: e
												.target
												.value,
										}
									)
								)
							}
						/>
					</div>

					<div className="mb-4">
						<div className="flex text-darkred">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
									clip-rule="evenodd"
								/>
							</svg>
							<h4 className="ml-[3px] font-medium">
								Brands
							</h4>
						</div>
						<CheckboxButton
							options={brands}
							checked={
								productParams.brands
							}
							onChange={(
								options: string[]
							) =>
								dispatch(
									setProductParams(
										{
											brands: options,
										}
									)
								)
							}
						/>
					</div>

					<div>
						<div className="flex text-darkred">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
									clip-rule="evenodd"
								/>
							</svg>
							<h4 className="ml-[3px] font-medium">
								Types
							</h4>
						</div>
						<CheckboxButton
							options={types}
							checked={
								productParams.types
							}
							onChange={(
								options: string[]
							) =>
								dispatch(
									setProductParams(
										{
											types: options,
										}
									)
								)
							}
						/>
					</div>
				</Grid>
				<Grid item xs={10} sx={{ mb: 4 }}>
					<ProductList products={products} />
				</Grid>
				<Grid item xs={2} />
				<Grid item xs={10}>
					{pagination && (
						<AppPagination
							pagination={pagination}
							onPageChange={(
								page: number
							) =>
								dispatch(
									setPageNumber(
										{
											pageNumber: page,
										}
									)
								)
							}
						/>
					)}
				</Grid>
			</Grid>
		</div>
	);
};

export default Catalog;
