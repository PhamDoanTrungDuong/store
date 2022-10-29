import BasketSumary from "./BasketSumary";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";
import { GrStripe } from "react-icons/gr";
import agent from "../../app/api/agent";
import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";

const Basket: React.FC = () => {
	const { basket } = useAppSelector((state) => state.basket);
	//=====================MOMO=============================
	// App - Basket - MoMopayment - agent - appsettings
	const { user } = useAppSelector((state) => state.account);
	let navigate = useNavigate();

	const handlePayment = () => {
		if (!user) {
			return navigate("/login");
		} else {
			agent.Payments.momoPayment().then((res: any) => {
				window.location.replace(res.payUrl);
			});
		}
	};
	const handleVnPayPayment = () => {
		if (!user) {
			return navigate("/login");
		} else {
			agent.Payments.vnpayPayment().then((res: any) => {
				window.location.replace(res);
			});
		}
	};
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
					<div className="mt-5">
						<h1 className="text-lg text-center text-gray-400 font-bold italic">
							Please choose your payment methods!!!
						</h1>
						<div className="flex justify-between gap-3">
							{/* <div className="w-[50%]">
								<button
									onClick={handlePayment}
									className="bg-[#A50064] border border-[#A50064] text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2">
									<img src="/images/momo-2.svg" alt="" />
								</button>
							</div>
							<div className="w-[50%]">
								<button
									onClick={handleVnPayPayment}
									className="bg-transparent border border-gray-300 text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2"
									>
									<img src="/images/vnpay-2.svg" alt=""/>
								</button>
							</div> */}
							<Link to="/checkout" className="w-full">
								<button className="bg-indigo-600 border border-indigo-600 text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2">
									<GrStripe size={20} />{" "}
									<p className="pt-1 font-bold italic">
										Stripe
									</p>
								</button>
							</Link>
							<Link to="/normal-checkout" className="w-full">
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
		</div>
	);
};

export default Basket;
