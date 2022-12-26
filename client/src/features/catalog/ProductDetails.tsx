import { Box, Rating } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
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
			{value === index && (
				<Box sx={{ p: 3 }}>
					{children}
				</Box>
			)}
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
	const [selectedColor, setSelectedColor] = useState("white");
	const [selectedSize, setSelectedSize] = useState("S");
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

	const idProduct = params.id;

	const { id } = useParams<{ id: any }>();
	const product = useAppSelector((state) => productSelector.selectById(state, id));

	const productView = useCallback(async () => {
		try {
			if (id !== undefined)
			agent.Catalog.productViewCount(Number(id));
		} catch (error) {
			console.log(error);
		}
	}, [id]);

	useEffect(() => {
		productView()
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
	}, [id]);

	const [quantity, setQuantity] = useState(0);

	const item = basket?.items.find((i) => i.productId === product?.id);

	useEffect(() => {
		if (item) setQuantity(item.quantity);
		if (!product) dispatch(fetchProductAsync(+id));
	}, [id, item, dispatch, product]);

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
					title: "Your comments had been record",
					showConfirmButton: false,
					timer: 1500,
				});
			});
		}
	};

	const handleColor = (value: string) => {
		setSelectedColor(value);
	};
	const handleSize = (value: string) => {
		setSelectedSize(value);
	};

	

	return (
		<div className="mt-5 p-5">
			<div className="flex items-center ml-3 mt-3 mb-4">
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
											).toFixed(2)}
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
											).toFixed(2)}
										</h5>
									</div>
								</>
							) : (
								<h5 className="text-2xl md:text-3xl font-bold text-indigo-600">
									${(product.price / 100).toFixed(2)}
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
						<div className="flex items-center gap-4 ">
								<h2>Quantity</h2>
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
						<div className="text-lg text-gray-500">
								{product.quantityInStock} product in stock
						</div>
						
					</div>
					<div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
						<div className="flex items-center">
							<span className="mr-3">Color:</span>
							{colors && colors.map((color: any, idx) => {
								var color1 = `bg-${color.colour_value}-500`
								return (
									<span key={color.id}>
										<div onClick={() => handleColor(color.colour_value)} className={`${color1} border-2 border-gray-300 ${selectedColor === color.colour_value ? "border-black/70" : ""} ml-1 rounded-full w-6 h-6 focus:outline-none`}></div>
									</span>
								)
							})}
						</div>
						<div className="flex ml-6 items-center">
							<span className="mr-3">Size:</span>
							<div className="relative">
								<select onChange={(e) => handleSize(e.target.value)} className="rounded border appearance-none border-gray-700 py-2 focus:outline-none focus:border-indigo-600 text-base pl-3 pr-10">
									{sizes && sizes.map((size: any, idx) => {
										return (
											<option key={idx} value={size.size_value}>{size.size_value}</option>
										)
									})}
								</select>
								<span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
									<IoIosArrowDown />
								</span>
							</div>
						</div>
					</div>
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
							{item ? "Update Quantity" : "Add to Cart"}
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
								label="Description"
								{...a11yProps(0)}
							/>
							<Tab
								label="Shipping and Return"
								{...a11yProps(1)}
							/>
							<Tab label="Review" {...a11yProps(2)} />
						</Tabs>
					</Box>
					<TabPanel value={value} index={0}>
						<h2 className="text-lg text-gray-400">{product.description}</h2>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<h1 className='text-xl font-bold italic'>
						Returns Policy
						</h1>
						<p className="text-md text-gray-400 my-2">+ You may return most new, unopened items within 30 days of delivery for a full refund. We'll also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item, etc.).</p>
						<p className="text-md text-gray-400 my-2">+ You should expect to receive your refund within four weeks of giving your package to the return shipper, however, in many cases you will receive a refund more quickly. This time period includes the transit time for us to receive your return from the shipper (5 to 10 business days), the time it takes us to process your return once we receive it (3 to 5 business days), and the time it takes your bank to process our refund request (5 to 10 business days).</p>
						<p className="text-md text-gray-400 my-2">+ If you need to return an item, simply login to your account, view the order using the 'Complete Orders' link under the My Account menu and click the Return Item(s) button. We'll notify you via e-mail of your refund once we've received and processed the returned item.</p>
						<h1 className='text-xl font-bold italic'>
						Shipping
						</h1>
						<p className="text-md text-gray-400 my-2">+ We can ship to virtually any address in the world. Note that there are restrictions on some products, and some products cannot be shipped to international destinations.</p>
						<p className="text-md text-gray-400 my-2">+ When you place an order, we will estimate shipping and delivery dates for you based on the availability of your items and the shipping options you choose. Depending on the shipping provider you choose, shipping date estimates may appear on the shipping quotes page.</p>
						<p className="text-md text-gray-400 my-2">+ Please also note that the shipping rates for many items we sell are weight-based. The weight of any such item can be found on its detail page. To reflect the policies of the shipping companies we use, all weights will be rounded up to the next full pound.</p>
					</TabPanel>
					<TabPanel value={value} index={2}>
						<div>
							<form
								onSubmit={handleSubmit(
									submitComment
								)}
								className="w-full bg-white rounded-xl pt-2">
								<h2 className="px-4 pt-3 pb-2 text-black text-lg font-medium">
									Add a new comment
								</h2>
								<div className="flex flex-col md:flex-row justify-between mx-3 mb-6">
									<div className="w-full md:w-full px-2 mb-2 mt-2">
										<div className="flex justify-start items-center my-2">
											<span className="mr-3 font-medium">
												Evaluate:
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
												placeholder="Type Your Comment"
											/>
										</div>
									</div>
									<div className="w-full md:w-full flex flex-row justify-end md:justify-start px-1 md:m-2 items-end">
										<div className="mr-1">
											<button
												type="submit"
												className="bg-indigo-600 border text-sm md:text-base border-indigo-600 text-white p-3 w-full rounded-lg shadow-xl hover:shadow-2xl hover:bg-transparent hover:text-indigo-600 duration-200">
												Submit
											</button>
										</div>
									</div>
								</div>
							</form>
						</div>
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
