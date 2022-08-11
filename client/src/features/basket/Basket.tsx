import BasketSumary from "./BasketSumary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";

const Basket: React.FC = () => {
	const { basket } = useAppSelector((state) => state.basket);

	if (!basket)
		return (
			<div className=" mt-5 h-screen p-4">
				<h1 className="text-2xl font-bold">
					Your basket is empty{" "}
					<span>
						<Link className='text-indigo-600 underline underline-offset-4' to="/catalog">
							go to shopping
						</Link>
					</span>
				</h1>
			</div>
		);

	return (
		<div className=" mt-5 p-4">
			<div className="flex flex-row gap-3">
				<div className="basis-2/3 overflow-y-scroll scroll-smooth h-[500px]">
					<BasketTable items={basket.items} />
				</div>
				<div className="basis-1/3">
						<BasketSumary />
						<Link to="/checkout">
							<button
								className="bg-indigo-600 border border-indigo-600 text-white p-4 w-full rounded-lg shadow-xl hover:shadow-2xl my-2 hover:bg-transparent hover:text-indigo-600 duration-200">
								Checkout
							</button>
						</Link>
				</div>
			</div>
		</div>
	);
};

export default Basket;
