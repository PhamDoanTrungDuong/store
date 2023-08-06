import React, { useEffect, useState } from "react";
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
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useTranslation } from "react-i18next";

const marks = [
	{
	  value: 0,
	  label: '$0',
	},
	{
	  value: 10000,
	  label: '$100',
	},
	{
	  value: 20000,
	  label: '$200',
	},
	{
	  value: 30000,
	  label: '$300',
	},
	{
	  value: 40000,
	  label: '$400',
	},
	{
	  value: 50000,
	  label: '$500',
	},
 ];

function valuetext(value: number) {
	return `${value}°C`;
}

const Catalog: React.FC = () => {
	const { t } = useTranslation();
	const sortOptions = [
		{ value: "latest", label: t('Cat_Latest') },
		{ value: "name", label: t('Cat_Alpha') },
		{ value: "priceDesc", label: t('Cat_HTL') },
		{ value: "price", label: t('Cat_LTH') },
	];

	const { products, filtersLoaded, brands, categories, pagination } = useProducts();

	const [value, setValue] = useState<number[]>([0, 50000]);

	const handleChange = (event: Event, newValue: any) => {
		setValue(newValue as number[]);
		const target = event.target as HTMLButtonElement;
		dispatch(
			setProductParams({
				minPrice: target.value[0].toString(),
				maxPrice: target.value[1].toString(),
			})
		)
	};

	var cate = categories.map((item: any) => {
		return item.name;
	});

	const { productParams } = useAppSelector((state) => state.catalog);
	const { status } = useAppSelector((state) => state.basket);

	const dispatch = useAppDispatch();
	var titleSwal = t('Sw_AddedSuccess');
	useEffect(() => {
		if (status === "addSuccess") {
			Swal.fire({
				icon: "success",
				title: titleSwal,
				showConfirmButton: false,
				timer: 1500,
			});
		}
		return () => {
			dispatch(setStateBasket());
		};
	}, [dispatch, status, titleSwal]);

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
									{t('Cat_Sort')}
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
							<div className="mt-5">
								<div className="flex text-darkred">
									<div>
										<FiFilter
											size={20}
										/>
									</div>
									<h4 className="ml-[3px] mb-3 font-medium">
										{t('Cat_Price')}
									</h4>
								</div>
								<Box sx={{ width: 200 }}>
									<Slider
										min={0}
										max={50000}
										step={10000}
										marks={marks}
										getAriaLabel={() =>
											"Price range"
										}
										value={value}
										onChange={
											handleChange
										}
										valueLabelDisplay="auto"
										getAriaValueText={
											valuetext
										}
									/>
								</Box>
							</div>
						</div>

						<div className="mb-4">
							<div className="flex text-darkred">
								<div>
									<RiBookmark3Line
										size={20}
									/>
								</div>
								<h4 className="ml-[3px] font-medium">
									{t('Cat_Brand')}
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
									{t('Cat_Cats')}
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
									{t('Cat_Home')}
								</h1>
							</Link>
							<div className="mx-2">
								<IoIosArrowForward size={15} />
							</div>
							<Link to="/catalog">
								<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
									<BiCategoryAlt size={20} />
									{t('Cat_Catalog')}
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
