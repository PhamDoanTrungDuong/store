import React, { useEffect } from "react";
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
import Swal from "sweetalert2";
import { setStateBasket } from "../basket/basketSlice";

const sortOptions = [
	{ value: "latest", label: "Latest Product" },
	{ value: "name", label: "Alphabetical" },
	{ value: "priceDesc", label: "Hight to low" },
	{ value: "price", label: "Low to hight" },
];

const Catalog: React.FC = () => {
	const { products, filtersLoaded, brands, types, pagination } = useProducts();

	const { productParams } = useAppSelector((state) => state.catalog);
	const { status } = useAppSelector((state) => state.basket);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if(status === "addSuccess"){
			Swal.fire({
				icon: 'success',
				title: 'Added Product Successful',
				showConfirmButton: false,
				timer: 1500
			    })
			}
		return () => {
			dispatch(setStateBasket());
		}
	}, [dispatch, status])


	if (!filtersLoaded) return <Loading message="Loading Catalog..." />;

	return (
		<div className="rounded-div mt-5">
			<div>
				<div className="flex flex-row my-4">
					<div className="basis-1/5">
						<div className="mb-4"></div>

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
								selectedValue={
									productParams.orderBy
								}
								options={sortOptions}
								onChange={(e) =>
									dispatch(
										setProductParams({
											orderBy: e
												.target
												.value,
										})
									)
								}
							/>
						</div>

						<div className="mb-4">
							<div className="flex text-darkred">
								<div>
									<RiBookmark3Line
										size={20}
									/>
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
									<RiBookmark3Line
										size={20}
									/>
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
					</div>
					<div className="basis-4/5">
						<ProductSearch />
						<ProductList products={products} />
					</div>
				</div>

				<div className="flex flex-row my-4 mb-5">
					<div className="basis-1/5"></div>
					<div className="basis-4/5">
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default Catalog;
