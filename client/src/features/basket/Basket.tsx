import BasketSumary from "./BasketSumary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";

const Basket: React.FC = () => {
	const { basket } = useAppSelector((state) => state.basket);

	if (!basket)
		return (
			<div className=" mt-20 h-screen p-4 flex flex-col justify-start items-center mt-">
				<div className="w-[50%]">
					<img src="/images/empty_cart.png" alt="" />
				</div>
				<div className="my-10 flex flex-col items-center">
					<h1 className="text-xl font-bold">Your Cart is Empty</h1>
					<p className="text-lg font-medium my-2">Add something to make you happy :)</p>
					<button className="c-btn">
						<Link
							className="font-medium"
							to="/catalog">
							Go to shopping
						</Link>
					</button>
				</div>
			</div>
		);

	return (
		<div className=" mt-5 p-4">
			<div className="flex flex-col md:flex-row gap-3">
				<div className="md:basis-2/3 overflow-y-scroll scroll-smooth h-[500px]">
					<BasketTable items={basket.items} />
				</div>
				<div className="md:basis-1/3">
					<BasketSumary />
					<Link to="/checkout">
						<button className="bg-indigo-600 border border-indigo-600 text-white p-4 w-full rounded-lg shadow-xl hover:shadow-2xl my-2 hover:bg-transparent hover:text-indigo-600 duration-200">
							Checkout
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Basket;
