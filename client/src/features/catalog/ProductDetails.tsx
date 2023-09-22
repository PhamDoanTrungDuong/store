import { Box, Rating } from "@mui/material";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync, setStateBasket } from "../basket/basketSlice";
import { fetchProductAsync, fetchProductsDiscountAsync, productSelector } from "./catalogSlice";
import { SubmitHandler, useForm } from "react-hook-form";
import CommentThread from "./CommentThread";
import agent from "../../app/api/agent";
import Swal from "sweetalert2";
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
// import useProducts from "../../app/hooks/useProducts";
import { IProductDiscount } from "../../app/interfaces/IProduct";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { FaHashtag } from "react-icons/fa";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useTranslation } from "react-i18next";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}
interface Inputs {
	productId: string;
	content: string;
}


const ProductDetails: React.FC = () => {
	// const myComponentRef = useRef<any>(null);

	// const focusOnComponent = () => {
	// 		myComponentRef.current!.focus();
	// };
	const { user } = useAppSelector((state) => state.account);
	
	const { t } = useTranslation();

	const { productDiscount, productsLoaded } = useAppSelector((state) => state.catalog);
	const [Sales, setSales] = useState<IProductDiscount>();

	const [value, setValue] = React.useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const { register, handleSubmit } = useForm<Inputs>();
	const [valuesStar, setValuesStar] = useState<number | null>(0);
	const [colors, setColors] = useState([]);
	const [sizes, setSizes] = useState([]);
	const [orderComment, setOrderComment] = useState<any>();
	const [variants, setVariantPerProduct] = useState<any>();
	const [selectedColor, setSelectedColor] = useState("white");
	const [selectedSize, setSelectedSize] = useState("S");
	const [variantsProduct, setVariantsProduct] = useState<any>();
	const [productQty, setProductQty] = useState<any>();
	const [avg, setAvg] = useState<number>(0);
	const { basket } = useAppSelector((state) => state.basket);
	const { status: productStatus } = useAppSelector((state) => state.catalog);
	const dispatch = useAppDispatch();
	const params = useParams();
	const { status } = useAppSelector((state) => state.basket);
	const [hover, setHover] = useState(-1);
	const labels: { [index: string]: string } = {
		1: "Useless+",
		2: "Poor+",
		3: "Ok+",
		4: "Good+",
		5: "Excellent+",
	};
	function getLabelText(value: number) {
		return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
	}
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

	const idProduct = params.id;

	const { id } = useParams<{ id: any }>();
	const product = useAppSelector((state) => productSelector.selectById(state, id));

	const productView = useCallback(async () => {
		try {
			if (id !== undefined) agent.Catalog.productViewCount(Number(id));
		} catch (error) {
			console.log(error);
		}
	}, [id]);

	useEffect(() => {
		productView();
	}, [productView]);

	useEffect(() => {
		if (id !== undefined)
			agent.Comment.getRatings(Number(id))
				.then((res) => setAvg(res))
				.catch((error) => console.log(error));
	}, [avg, id]);

	useEffect(() => {
		if (!productsLoaded) dispatch(fetchProductsDiscountAsync());
	}, [dispatch, productsLoaded]);

	useEffect(() => {
		setSales(productDiscount.find((item) => +item.productId === +id));
	}, [productDiscount, id]);

	useEffect(() => {
		if (id !== undefined)
			agent.Catalog.getColors()
				.then((res) => setColors(res))
				.catch((error) => console.log(error));
			agent.Catalog.getSizes()
				.then((res) => setSizes(res))
				.catch((error) => console.log(error));
		try {
			agent.Catalog.variantsDetail(id)
				.then((res) => {
					setVariantPerProduct(res)
				})
				.catch((error) => console.log(error));
		} catch (error) {
			console.log(error)
		}
	}, [id]);

	const [quantity, setQuantity] = useState(0);

	const item = basket?.items.find((i) => i.productId === product?.id);

	useEffect(() => {
		if (item) setQuantity(item.quantity);
		if (!product) {
			dispatch(fetchProductAsync(+id));
		}
	}, [id, item, dispatch, product]);

	useEffect(() => {
		agent.Catalog.productVariants(+id)
				.then((res) => setVariantsProduct(res))
				.catch((error) => console.log(error));
	}, [id])

	useEffect(() => {
		variantsProduct && variantsProduct.filter((item: any) => (
					item.colourValue === selectedColor && item.sizeValue === selectedSize
				)).map((i: any) => setProductQty(i.quantity))
	}, [selectedColor, selectedSize, variantsProduct])

	useEffect(() => {
		agent.Orders.getOrderComment()
			.then((res) => setOrderComment(res))
			.catch((err) => console.log(err))
	}, [])
	var arr: number[] = []
	orderComment && orderComment.flat().map((item: any) => {
		arr.push(item.itemOrdered.productId)
	})

	const handlePlus = () => {
		if (quantity <= 9) {
			setQuantity(+quantity + 1);
		}
	};
	const handleMinus = () => {
		if (quantity > 0) {
			setQuantity(+quantity - 1);
		}
	};

	const hanldeUpdateCart = () => {
		if (!item || quantity > item.quantity) {
			const updatedQty = item ? quantity - item.quantity : quantity;
			dispatch(
				addBasketItemAsync({
					productId: product?.id!,
					quantity: updatedQty,
					color: selectedColor,
					size: selectedSize,
				})
			);
		} else {
			const updatedQty = item.quantity - quantity;
			dispatch(
				removeBasketItemAsync({
					productId: product?.id!,
					quantity: updatedQty,
				})
			);
		}
	};

	if (productStatus.includes("pending")) return <Loading message="Loading Detail..." />;
	if (!product) return <NotFound />;
	const submitComment: SubmitHandler<Inputs> = (data: any, e: any) => {
		e.target.reset();
		setValuesStar(0);
		data = { ...data, rate: valuesStar, productId: idProduct };
		if (data) {
			agent.Comment.postComment(data).then(() => {
				Swal.fire({
					icon: "success",
					title: t('Sw_Record') as string,
					showConfirmButton: false,
					timer: 1500,
				});
			});
		}
	};

	const handleColor = (value: string) => {
		setSelectedColor(value)
	};
	const handleSize = (value: string) => {
		setSelectedSize(value);
	};
	// const numItems = 3;
	// var randomIndices: any;
	
	// // generate 3 unique random indices
	// while (randomIndices.length < numItems) {
	//   const randomIndex = Math.floor(Math.random() * colors.length);
	//   if (!randomIndices.includes(randomIndex)) {
	// 	 randomIndices.push(randomIndex);
	//   }
	// }

	// const randomColors = randomIndices.map((index: any) => colors[index]);
	// console.log(randomColors)

	return (
		<div className="mt-5 p-5">
			<div className="flex items-center ml-3 mt-3 mb-4">
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
				<div className="mx-2">
					<IoIosArrowForward size={15} />
				</div>
				<Link to={`/catalog/${id}`}>
					<h1 className="flex items-center hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<FaHashtag size={15} />
						{id}
					</h1>
				</Link>
			</div>
			<div className="grid md:grid-cols-2 ml-4">
				<div className="relative">
					<img
						className="border rounded-xl w-[100%] md:w-[80%] object-contain"
						src={product.pictureUrl}
						alt={product.name}
					/>
					{product?.quantityInStock! < 0 ? (
						<img
							src="/images/out-of-stock-2.png"
							alt={product.name}
							className="absolute top-0 left-3 w-[15%]"
						/>
					) : (
						""
					)}
					{Sales?.discountValue ? (
						<>
							<img
								src="/images/discount.png"
								alt={Sales.productName}
								className="absolute top-[-1px] right-28 w-[20%]"
							/>
							<p className="text-white rotate-6 font-bold text-2xl absolute top-[36px] right-[163px] z-10">
								{Sales?.discountValue}
							</p>
						</>
					) : (
						""
					)}
				</div>
				<div className="max-w-[400px] mt-5 md:mt-0">
					<div className="flex gap-10 items-center">
						<div className="p-2 uppercase font-bold text-black text-xs bg-[#DAD8E1] border w-fit">
							<h1>{product.type}</h1>
						</div>
						<div className="flex items-center">
							<p className="mr-2 text-lg md:text-xl text-indigo-600 font-medium underline underline-offset-4">
								{avg.toFixed(1)} /5
							</p>
							<Rating
								name="read-only"
								size="small"
								value={Math.ceil(avg)}
								readOnly
							/>
						</div>
					</div>
					<div className="mt-8">
						<h4 className="text-3xl font-bold">
							{product.name} 
							<div className="text-base text-gray-400 mr-3 pt-2">
								{product.quantityInStock} Total in Stock
							</div>
						</h4>
						<div className="my-4">
							{Sales?.discountValue ? (
								<>
									<div className="gap-2 md:text-3xl font-bold">
										<h5 className="text-gray-400 font-bold line-through">
											$
											{(
												product.price /
												100
											).toFixed(
												2
											)}
										</h5>
										<h5 className="font-bold text-2xl text-indigo-600">
											$
											{(
												Sales.price /
													100 -
												(Sales.price *
													(Sales.discountValue /
														100)) /
													100
											).toFixed(
												2
											)}
										</h5>
									</div>
								</>
							) : (
								<h5 className="text-2xl md:text-3xl font-bold text-indigo-600">
									$
									{(
										product.price / 100
									).toFixed(2)}
								</h5>
							)}
						</div>
					</div>
					<div className="text-[#C1C4C7]">
						<h4>SKU: #{product.id}</h4>
					</div>
					<div className="mt-5 text-gray-400">
						<p>{product.description}</p>
					</div>
					<div className="my-8 flex justify-between items-center">
						<div className="flex items-center gap-4 text-medium ">
							<h2>{t('De_Qty')}</h2>
							<button
								className="hover:text-red-600 p-3 border rounded-full"
								onClick={handleMinus}>
								<IoIosArrowBack />
							</button>
							<span className="text-xl ">{quantity}</span>
							<button
								className="hover:text-green-600 p-3 border rounded-full"
								onClick={handlePlus}>
								<IoIosArrowForward />
							</button>
						</div>
						<div className="text-medium text-gray-500">
							{
								(selectedColor !== "white" && selectedSize !== "S") || productQty !== undefined ? (
									productQty
								) : (product.quantityInStock)
							}
							{" "}
							{t('De_PIS')}
						</div>
					</div>
					{(variants && (variants.colors.length !== 0 && variants.sizes.length !== 0)) ? (
						<div className="flex items-center mt-6 pb-5 border-b-2 border-gray-200 mb-5">
							<div className="flex items-center">
								<span className="mr-3">{t('De_Color')}:</span>
								{variants && variants.colors.map((color: any, idx: number) => {
										// var color1 = `bg-${color.colour_value}-500`;
										return (
												<div
													key={
														color.colour_value
													}
													onClick={() =>
														handleColor(
															color.colour_value
														)
													}
													className={`${color.colour_value === "red" ? "bg-red-500" : color.colour_value === "teal" ? "bg-teal-500" : color.colour_value === "orange" ? "bg-orange-500" : color.colour_value === "sky" ? "bg-sky-500" : ""} border-[3px] border-gray-300 ${
														selectedColor ===
														color.colour_value
															? "border-black/70"
															: ""
													} ml-1 rounded-full w-6 h-6 focus:outline-none`}></div>
										);
									})}
							</div>
							<div className="flex ml-6 items-center">
								<span className="mr-3">{t('De_Size')}:</span>
								<div className="relative">
									<select
										onChange={(e) =>
											handleSize(
												e.target
													.value
											)
										}
										className="rounded border appearance-none border-gray-700 py-2 focus:outline-none focus:border-indigo-600 text-base pl-3 pr-10">
										{variants && [" ", ...variants.sizes].map(
												(
													size: any,
													idx: number
												) => {
													return (
														<option
															key={
																idx
															}
															value={
																size.size_value
															}>
															{
																size.size_value
															}
														</option>
													);
												}
											)}
									</select>
									<span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
										<IoIosArrowDown />
									</span>
								</div>
							</div>
						</div>
					) : (
						<div className="flex items-center mt-6 pb-5 border-b-2 border-gray-200 mb-5">
							<div className="flex items-center">
								<span className="mr-3">{t('De_Color')}:</span>
								{colors &&
									colors.map((color: any, idx) => {
										// var color1 = `bg-${color.colour_value}-500`;
										return (
												<div
													key={
														color.colour_value
													}
													onClick={() =>
														handleColor(
															color.colour_value
														)
													}
													className={`${color.colour_value === "red" ? "bg-red-500" : color.colour_value === "teal" ? "bg-teal-500" : color.colour_value === "orange" ? "bg-orange-500" : color.colour_value === "sky" ? "bg-sky-500" : ""} border-2 border-gray-300 ${
														selectedColor ===
														color.colour_value
															? "border-black/70"
															: ""
													} ml-1 rounded-full w-6 h-6 focus:outline-none`}>
													</div>
										);
									})}
							</div>
							<div className="flex ml-6 items-center">
								<span className="mr-3">{t("De_Size")}:</span>
								<div className="relative">
									<select
										onChange={(e) =>
											handleSize(
												e.target
													.value
											)
										}
										className="rounded border appearance-none border-gray-700 py-2 focus:outline-none focus:border-indigo-600 text-base pl-3 pr-10">
										{sizes &&
											[" ", ...sizes].map(
												(
													size: any,
													idx
												) => {
													return (
														<option
															key={
																idx
															}
															value={
																size.size_value
															}>
															{
																size.size_value
															}
														</option>
													);
												}
											)}
									</select>
									<span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
										<IoIosArrowDown />
									</span>
								</div>
							</div>
						</div>
					)}
					<div>
						<button
							className={
								item?.quantity === quantity ||
								(!item && quantity === 0)
									? "p-4 w-full text-white bg-zinc-300 rounded-lg"
									: "p-4 w-full text-white bg-indigo-600 hover:bg-transparent hover:text-indigo-600 duration-300 border border-indigo-600 rounded-lg"
							}
							disabled={
								item?.quantity === quantity ||
								(!item && quantity === 0)
							}
							onClick={hanldeUpdateCart}>
							{item ? t('De_UpdateCart') : t('De_AddCart')}
						</button>
					</div>
				</div>
			</div>

			<div className="mt-10 mx-auto">
				<Box sx={{ width: "100%" }}>
					<Box>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="basic tabs example">
							<Tab
								label={t('De_Desc')}
								{...a11yProps(0)}
							/>
							<Tab
								label={t('De_Policy')}
								{...a11yProps(1)}
							/>
							<Tab label={t('De_Review')} {...a11yProps(2)} />
						</Tabs>
					</Box>
					<TabPanel value={value} index={0}>
						<h2 className="text-lg text-gray-400">
							{product.description}
						</h2>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<h1 className="text-xl font-bold italic">
							{t('De_ReturnPolicy')}
						</h1>
						<p className="text-md text-gray-400 my-2">
							{t('De_Pol1')}
						</p>
						<p className="text-md text-gray-400 my-2">
							{t('De_Pol2')}
						</p>
						<p className="text-md text-gray-400 my-2">
							{t('De_Pol3')}
						</p>
						<h1 className="text-xl font-bold italic">
							{t('De_Ship')}
						</h1>
						<p className="text-md text-gray-400 my-2">
							{t('De_ShipPol1')}
						</p>
						<p className="text-md text-gray-400 my-2">
							{t('De_ShipPol2')}
						</p>
						<p className="text-md text-gray-400 my-2">
							{t('De_ShipPol3')}
						</p>
					</TabPanel>
					<TabPanel value={value} index={2}>
						{
							(arr.includes(+idProduct!) && user) ? (
								<div>
								<form
									onSubmit={handleSubmit(
										submitComment
									)}
									className="w-full bg-white rounded-xl pt-2">
									<h2 className="px-4 pt-3 pb-2 text-black text-lg font-medium">
										{t('De_Comment')}
									</h2>
									<div className="flex flex-col md:flex-row justify-between mx-3 mb-6">
										<div className="w-full md:w-full px-2 mb-2 mt-2">
											<div className="flex justify-start items-center my-2">
												<span className="mr-3 font-medium">
													{t('De_Evaluate')}:
												</span>
												<div className="flex gap-1">
													<Rating
														name="simple-controlled"
														value={
															valuesStar
														}
														getLabelText={
															getLabelText
														}
														onChange={(
															event,
															newValue
														) => {
															setValuesStar(
																newValue
															);
														}}
														onChangeActive={(
															event,
															newHover
														) => {
															setHover(
																newHover
															);
														}}
													/>
													<span>
														{valuesStar !==
															null && (
															<Box
																sx={{
																	ml: 2,
																}}>
																{
																	labels[
																		hover !==
																		-1
																			? hover
																			: valuesStar
																	]
																}
															</Box>
														)}
													</span>
												</div>
											</div>
											<div>
												<input
													{...register(
														"content"
													)}
													className=" rounded border border-gray-300 leading-normal resize-none w-full px-5 py-3 focus:outline-none focus:bg-white"
													name="content"
													placeholder={t('De_Type') as string}
													// ref={myComponentRef}
												/>
											</div>
										</div>
										<div className="w-full md:w-full flex flex-row justify-end md:justify-start px-1 md:m-2 items-end">
											<div className="mr-1">
												<button
													type="submit"
													className="bg-indigo-600 border text-sm md:text-base border-indigo-600 text-white p-3 w-full rounded-lg shadow-xl hover:shadow-2xl hover:bg-transparent hover:text-indigo-600 duration-200">
													{t('De_Submit')}
												</button>
											</div>
										</div>
									</div>
								</form>
							</div>
							) : (
								<div>
									<h2 className="px-4 pt-3 pb-2 text-black text-lg font-medium">
										{t('De_CommentRe')}
									</h2>
								</div>
							)
						}
						
						<div className="my-5 w-full md:w-4/6 h-auto overflow-y-scroll scrollbar-hide">
							<CommentThread idProduct={idProduct} />
						</div>
					</TabPanel>
				</Box>
			</div>
		</div>
	);
};

export default ProductDetails;
