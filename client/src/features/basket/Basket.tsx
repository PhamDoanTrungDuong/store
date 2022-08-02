import { Button, Grid } from "@mui/material";
import BasketSumary from "./BasketSumary";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";

const Basket: React.FC = () => {
	const { basket } = useAppSelector((state) => state.basket);

	if (!basket)
		return (
			<div className="rounded-div mt-5 h-screen p-4">
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
		<div className="rounded-div mt-5 p-4">
			<BasketTable items={basket.items} />
			<Grid container className="mb-[100px]">
				<Grid item xs={12}>
					<BasketSumary />
					<Button
						component={NavLink}
						to="/checkout"
						variant="contained"
						size="large"
						fullWidth
						className="my-3">
						Checkout
					</Button>
				</Grid>
			</Grid>
		</div>
	);
};

export default Basket;
