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
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";

const sortOptions = [
	{ value: "latest", label: "Latest Product" },
	{ value: "name", label: "Alphabetical" },
	{ value: "priceDesc", label: "Hight to low" },
	{ value: "price", label: "Low to hight" },
];

const Catalog: React.FC = () => {
	const { products, filtersLoaded, brands, categories, pagination } = useProducts();

	var cate = categories.map((item: any) => {
		return item.name;
	});

	const { productParams } = useAppSelector((state) => state.catalog);
	const { status } = useAppSelector((state) => state.basket);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (status === "addSuccess") {
			Swal.fire({
				icon: "success",
				title: "Added Product Successful",
				showConfirmButton: false,
				timer: 1500,
			});
		}
		return () => {
			dispatch(setStateBasket());
		};
	}, [dispatch, status]);

	if (!filtersLoaded) return <Loading message="Loading Catalog..." />;

	return (
		<div className="mt-5">
			<div>
				<div className="flex flex-row my-4">
					<div className="hidden md:block basis-1/5">
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
									Categories
								</h4>
							</div>
							<CheckboxButton
								options={cate}
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
					<div className="basis md:basis-4/5">
						<div className="flex items-center ml-2 mt-3 my-4">
							<Link to="/">
								<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
								<AiOutlineHome size={20} />
									Home
								</h1>
							</Link>
							<div className="mx-2">
								<IoIosArrowForward size={15} />
							</div>
							<Link to="/catalog">
							<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
								<BiCategoryAlt size={20} />
									Catalog
								</h1>
							</Link>
						</div>
						<ProductSearch />
						<ProductList products={products} />
					</div>
				</div>

				<div className="flex flex-row my-4 mb-5">
					<div className="basis sm:basis-1/5"></div>
					<div className="basis md:basis-4/5">
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
