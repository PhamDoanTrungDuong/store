import BasketSumary from "./BasketSumary";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";
import { GrStripe } from "react-icons/gr";
import agent from "../../app/api/agent";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { fetchVouchers, setSelectedVoucher } from "../admin/adminSlice";
import moment from "moment";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 800,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const Basket: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [choosenVoucher, setChoosenVoucher] = useState<any>();
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const { basket } = useAppSelector((state) => state.basket);
	const { vouchers, loadVoucher, selectedVoucher } = useAppSelector((state) => state.admin);
	const dispatch = useAppDispatch();

	useEffect(() => {
		loadVoucher ? dispatch(fetchVouchers()) : dispatch(fetchVouchers());
	}, [dispatch, loadVoucher]);

	//=====================MOMO=============================
	// App - Basket - MoMopayment - agent - appsettings
	const { user } = useAppSelector((state) => state.account);
	let navigate = useNavigate();
	var discount = selectedVoucher.value ? selectedVoucher.value : 0;

	const handlePayment = () => {
		if (!user) {
			return navigate("/login");
		} else {
			agent.Payments.momoPayment(discount).then((res: any) => {
				window.location.replace(res.payUrl);
			});
		}
	};
	console.log("DISCOUNT: ", discount);
	const handleVnPayPayment = () => {
		if (!user) {
			return navigate("/login");
		} else {
			agent.Payments.vnpayPayment(discount).then((res: any) => {
				window.location.replace(res);
			});
		}
	};

	const handleSelectedVoucher = () => {
		handleClose()
		dispatch(setSelectedVoucher(choosenVoucher));
	}
	//======================================================

	if (!basket)
		return (
			<div className=" mt-20 h-screen p-4 flex flex-col justify-start items-center">
				<div className="w-[50%]">
					<img src="/images/empty_cart.png" alt="" />
				</div>
				<div className="my-10 flex flex-col items-center">
					<h1 className="text-xl font-bold">Your Cart is Empty</h1>
					<p className="text-lg font-medium my-2">
						Add something to make you happy :)
					</p>
					<button className="c-btn">
						<Link className="font-medium" to="/catalog">
							Go to shopping
						</Link>
					</button>
				</div>
			</div>
		);

	return (
		<div className=" mt-5 p-4">
			<div className="flex items-center ml-2 mt-3 mb-5">
				<Link to="/">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineHome size={20} />
						Home
					</h1>
				</Link>
				<div className="mx-2">
					<IoIosArrowForward size={15} />
				</div>
				<Link to="/basket">
					<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
						<AiOutlineShoppingCart size={20} />
						Cart
					</h1>
				</Link>
			</div>
			<div className="flex flex-col md:flex-row gap-3">
				<div className="md:basis-[70%] overflow-y-scroll scroll-smooth h-[500px]">
					<BasketTable items={basket.items} />
				</div>
				<div className="md:basis-[30%]">
					<BasketSumary />
					{selectedVoucher !== 0 ?
						<div className="p-3 border border-orange-400 mt-4">
							<p className="text-xl">Discount for basket: <span className="font-bold">{selectedVoucher.value}%</span></p>
						</div> : <div></div>
					}
					<div className="my-3 w-full">
						<button
							className="bg-orange-600 border border-orange-600 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-orange-600 duration-200 w-full"
							onClick={handleOpen}>
							Vouchers
						</button>
					</div>
					<div className="mt-5">
						<h1 className="text-lg text-center text-gray-400 font-bold italic">
							Please choose your payment methods!!!
						</h1>
						<div className="flex justify-between gap-3">
							<div className="w-[50%]">
								<button
									onClick={handlePayment}
									className="bg-[#A50064] border border-[#A50064] text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2">
									<img
										src="/images/momo-2.svg"
										alt=""
									/>
								</button>
							</div>
							<div className="w-[50%]">
								<button
									onClick={handleVnPayPayment}
									className="bg-transparent border border-gray-300 text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2">
									<img
										src="/images/vnpay-2.svg"
										alt=""
									/>
								</button>
							</div>
							<Link to="/checkout" className="w-full">
								<button className="bg-indigo-600 border border-indigo-600 text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2">
									<GrStripe size={20} />{" "}
									<p className="pt-1 font-bold italic">
										Stripe
									</p>
								</button>
							</Link>
							<Link
								to="/normal-checkout"
								className="w-full">
								<button className="bg-indigo-400 border border-indigo-400 text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2">
									<p className="pt-1 font-bold italic">
										Checkout
									</p>
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box sx={style}>
					<div className="h-[500px] overflow-y-scroll">
						{vouchers.map((item: any, idx: number) => {
						return (
							<div key={idx} onClick={() => {
								setChoosenVoucher(item)
							}}>
								<div className={`flex my-5 cursor-pointer hover:bg-gray-100 ${choosenVoucher !== undefined && choosenVoucher.id === item.id ? "border border-orange-700" : ""}`}>
									<div className="w-[60%] h-[60%]">
										<img src="/images/voucher.jpg" alt="" />
									</div>
									<div className="p-4 w-full border border-black/25">
										<div className="text-3xl font-bold">{item.name}</div>
										<div className="text-xl font-medium my-1">Sale up to {item.value}%</div>
										<div className="text-orange-500">{moment(
																	item.exspire
																).format(
																	"lll"
																)}</div>
									</div>
								</div>
							</div>
						);
						})}
					</div>
					<div className="flex justify-end gap-4">
						<button className="c-btn" onClick={() => handleClose()}>Cancel</button>
						<button className="bg-orange-600 border border-orange-600 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-orange-600 duration-200" onClick={handleSelectedVoucher}>Aplly</button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default Basket;
