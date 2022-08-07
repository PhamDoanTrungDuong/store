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
import { FiFilter } from "react-icons/fi";
import { RiBookmark3Line } from "react-icons/ri";

const sortOptions = [
	{ value: "name", label: "Alphabetical" },
	{ value: "priceDesc", label: "Hight to low" },
	{ value: "price", label: "Low to hight" },
];

const Catalog: React.FC = () => {
	const { products, filtersLoaded, brands, types, pagination } = useProducts();

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
							<div>
								<FiFilter size={20} />
							</div>
							<h4 className="ml-[3px] font-medium">
								Sort Order
							</h4>
						</div>
						<RadioButtonGroup
							selectedValue={productParams.orderBy}
							options={sortOptions}
							onChange={(e) =>
								dispatch(
									setProductParams({
										orderBy: e.target
											.value,
									})
								)
							}
						/>
					</div>

					<div className="mb-4">
						<div className="flex text-darkred">
							<div>
								<RiBookmark3Line size={20} />
							</div>
							<h4 className="ml-[3px] font-medium">
								Brands
							</h4>
						</div>
						<CheckboxButton
							options={brands}
							checked={productParams.brands}
							onChange={(options: string[]) =>
								dispatch(
									setProductParams({
										brands: options,
									})
								)
							}
						/>
					</div>

					<div>
						<div className="flex text-darkred">
							<div>
								<RiBookmark3Line size={20} />
							</div>
							<h4 className="ml-[3px] font-medium">
								Types
							</h4>
						</div>
						<CheckboxButton
							options={types}
							checked={productParams.types}
							onChange={(options: string[]) =>
								dispatch(
									setProductParams({
										types: options,
									})
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
							onPageChange={(page: number) =>
								dispatch(
									setPageNumber({
										pageNumber: page,
									})
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
