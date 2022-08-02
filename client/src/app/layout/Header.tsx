import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Badge, IconButton } from "@mui/material";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const midLinks = [
	{ title: "Catalog", path: "/catalog" },
	{ title: "About", path: "/about" },
	{ title: "Contact", path: "/contact" },
];


const Header: React.FC = () => {
	const { basket } = useAppSelector((state) => state.basket);
	const { user } = useAppSelector((state) => state.account);
	const itemCount = basket?.items.reduce(
		(sum, item) => sum + item.quantity,
		0
	);

	return (
		<div className="rounded-div flex items-center justify-between h-20 font-bold">
			<div>
				<Link to="/">
					<h1 className="text-2xl font-bold text-primary">STORE.</h1>
				</Link>
			</div>
			<div className="flex items-center">
				{midLinks.map(({ title, path }) => (
					<Link
						className="text-primary p-4 hover:text-[#2b6cb0] hover:underline hover:underline-offset-2 duration-200"
						to={path}
						key={path}>
						{title}
					</Link>
				))}
				{user && user.roles?.includes("Admin") && (
					<Link
						className="text-primary hover:text-[#2b6cb0] duration-200"
						to="/inventory">
						Inventory
					</Link>
				)}
			</div>

			<div className="flex items-center justify-between ">
				<IconButton
					component={NavLink}
					to="/basket"
					size="large"
					sx={{ color: "inherit" }}>
					<Badge
						badgeContent={itemCount}
						color="warning">
						<ShoppingCartRoundedIcon className="text-zinc-900 hover:underline underline-offset-8 transition-all" />
					</Badge>
				</IconButton>
				{user ? (
					<SignedInMenu />
				) : (
					<div className='flex justify-evenly'>
						<Link className="text-primary py-2 ml-4 hover:text-[#2b6cb0] duration-200"
							to="/login">
							Sign In
						</Link>
						<Link className="bg-[#2b6cb0] border border-[#2b6cb0] text-white px-5 py-2 ml-4 rounded-3xl shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-[#2b6cb0] duration-200"
							to="/register">
							Sign up
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Header;
