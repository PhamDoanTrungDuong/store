import BasketSumary from "./BasketSumary";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";
import { GrStripe } from "react-icons/gr"
import agent from "../../app/api/agent";

const Basket: React.FC = () => {
	const { basket } = useAppSelector((state) => state.basket);
	//=====================MOMO=============================
	// App - Basket - MoMopayment - agent - appsettings
      const {user} = useAppSelector(state => state.account);
      let navigate = useNavigate();

	const handlePayment = () => {
		if (!user) {
			return navigate("/login");
		}else{
			agent.Payments.momoPayment().then((res: any) => {
				window.location.replace(res.payUrl);
			});
		}
	};
	//======================================================

	if (!basket)
		return (
			<div className=" mt-20 h-screen p-4 flex flex-col justify-start items-center mt-">
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
						{/* <div className="flex justify-between gap-3">
							<div className="w-full">
								<button
									onClick={handlePayment}
									className="bg-[#A50064] border border-[#A50064] text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2">
									<svg viewBox="6.7169296377637995 5.309796557160162 81.4130703622362 74.62020344283985" xmlns="http://www.w3.org/2000/svg" width="30" className="hover:fill-white text-[#a50064]" height="30"><rect fill="#a50064" height="87" rx="12.06" width="96"/><path d="M71 7.07c-9.45 0-17.11 7.36-17.11 16.43S61.57 39.93 71 39.93s17.13-7.36 17.13-16.43S80.47 7.07 71 7.07zm0 23.44a7.14 7.14 0 0 1-7.27-7 7.28 7.28 0 0 1 14.54 0 7.14 7.14 0 0 1-7.27 7zm-22-11.1V40h-9.88V19.31a2.9 2.9 0 0 0-5.8 0V40h-9.84V19.31a2.9 2.9 0 0 0-5.8 0V40H7.87V19.41A12.62 12.62 0 0 1 20.72 7.07a13.11 13.11 0 0 1 7.7 2.48 13.14 13.14 0 0 1 7.69-2.48A12.63 12.63 0 0 1 49 19.41zM71 47c-9.45 0-17.11 7.35-17.11 16.43S61.57 79.89 71 79.89s17.11-7.35 17.11-16.42S80.47 47 71 47zm0 23.44a7 7 0 1 1 7.27-7A7.14 7.14 0 0 1 71 70.48zM49 59.38v20.55h-9.88V59.27a2.9 2.9 0 0 0-5.8 0v20.66h-9.84V59.27a2.9 2.9 0 0 0-5.8 0v20.66H7.87V59.38A12.61 12.61 0 0 1 20.72 47a13.17 13.17 0 0 1 7.7 2.47A13.11 13.11 0 0 1 36.11 47 12.62 12.62 0 0 1 49 59.38z" fill="#fff"/></svg>
								</button>
							</div>
							stripe
						</div> */}
							<Link to="/checkout" className="w-full">
								<button className="bg-indigo-600 border border-indigo-600 text-white p-2 w-full rounded-lg shadow-lg my-2 hover:scale-105 hover:shadow-xl duration-200 flex justify-center items-center gap-2">
									<GrStripe size={20} /> <p className="pt-1 font-bold italic">Stripe</p>
								</button>
							</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Basket;
