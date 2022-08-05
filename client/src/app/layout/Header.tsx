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
				{!user?.roles?.includes("Admin") &&
					<Link to="/">
						<h1 className="text-3xl font-extrabold text-indigo-600">
							STORE.
						</h1>
					</Link>
				}
				{user?.roles?.includes("Admin") &&
					<Link to="/">
						<h1 className="text-3xl font-extrabold text-indigo-600">
							STORE.<span className="text-sm italic text-red-600">administration</span>
						</h1>
					</Link>
				}
			</div>
			<div className="flex items-center">
				<>
				{midLinks.map(({ title, path }) => {
					return (
						!user?.roles?.includes("Admin") && (
							<div key={title}>
								<Link
									className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
									to={path}
									key={path}>
									{title}
								</Link>
							</div>
						)
					)
				})}
				{user?.roles?.includes("Admin") && (
					<>
						<Link
							className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
							to="/inventory">
							Inventory
						</Link>
						<Link
							className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
							to="/role">
							Role
						</Link>
						<Link
							className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
							to="/admin-orders">
							Orders
						</Link>
					</>
				)}
				</>
			</div>

			<div className="flex items-center justify-between ">
				{!user?.roles?.includes("Admin") && 
					<div>
						<IconButton
							className="hover:text-indigo-600 duration-300"
							component={NavLink}
							to="/basket"
							size="large"
							sx={{ color: "inherit" }}>
							<Badge
								badgeContent={itemCount}
								color="warning">
								<ShoppingCartRoundedIcon />
							</Badge>
						</IconButton>
					</div>
				}
				{user ? (
					<SignedInMenu />
				) : (
					<div className="flex justify-evenly">
						<Link
							className="text-primary py-2 ml-4 hover:text-indigo-600 duration-200"
							to="/login">
							Sign In
						</Link>
						<Link
							className="bg-indigo-600 border border-indigo-600 text-white px-5 py-2 ml-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-indigo-600 duration-200"
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
