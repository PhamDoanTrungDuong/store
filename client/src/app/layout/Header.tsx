import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Badge, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const midLinks = [
	{ title: "Products", path: "/catalog" },
	{ title: "About", path: "/about" },
	{ title: "Contact", path: "/contact" },
];

const Header: React.FC = () => {
	const { basket } = useAppSelector((state) => state.basket);
	const { user } = useAppSelector((state) => state.account);
	const [nav, setNav] = useState(false);
	const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);

	const handleNav = () => setNav(!nav);

	return (
		<div className="rounded-div flex items-center justify-between h-20 font-bold">
			<div>
				{!user?.roles?.includes("Admin") && (
					<Link to="/">
						<h1 className="text-3xl font-rubik italic font-extrabold text-indigo-600">
							STORE.
						</h1>
					</Link>
				)}
				{user?.roles?.includes("Admin") && (
					<Link to="/">
						<h1 className="text-3xl font-rubik italic font-extrabold text-indigo-600">
							STORE.
							<span className="text-sm italic text-red-600">
								administration
							</span>
						</h1>
					</Link>
				)}
			</div>

			<div className="md:flex hidden items-center">
				<>
					{midLinks.map(({ title, path }) => {
						return (
							!user?.roles?.includes("Admin") && (
								<React.Fragment key={title}>
									<Link
										className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
										to={path}
										key={path}>
										{title}
									</Link>
								</React.Fragment>
							)
						);
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
							<Link
								className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
								to="/admin-comments">
								Comments
							</Link>
							<Link
								className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
								to="/admin-members">
								Members
							</Link>
						</>
					)}
				</>
			</div>

			<div className="flex items-center justify-between ">
				{!user?.roles?.includes("Admin") && (
					<div className="mr-2">
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
				)}
				<div className="hidden md:block">
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
								className="bg-indigo-600 border border-indigo-600 text-white px-5 py-2 ml-4 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-indigo-600 duration-200"
								to="/register">
								Sign up
							</Link>
						</div>
					)}
				</div>
				<div onClick={handleNav} className="sm:hidden cursor-pointer z-50">
					{!nav ? (
						<AiOutlineMenu size={20} />
					) : (
						<AiOutlineClose size={20} />
					)}
				</div>
			</div>
			<div
				className={
					nav
						? "absolute md:hidden h-screen top-0 left-0 flex flex-col justify-center items-center z-10 w-full px-4 py-7 duration-300 bg-zinc-50/80"
						: "absolute md:hidden h-screen top-0 left-[-100%] flex flex-col justify-center items-center z-10 w-full px-4 py-7 duration-300 bg-zinc-50/80"
				}>
				<ul>
					{midLinks.map(({ title, path }) => {
						return (
							!user?.roles?.includes("Admin") && (
								<li
									onClick={() => setNav(false)}
									className="p-4 text-xl"
									key={title}>
									<Link
										className="text-primary p-3 mt-3 font-bold hover:text-indigo-600 hover:scale-125 duration-300"
										to={path}
										key={path}>
										{title}
									</Link>
								</li>
							)
						);
					})}
					{user ? (
						<div className="flex justify-center items-center my-2">
							<SignedInMenu />
						</div>
					) : (
						<ul className="mt-4">
							<li onClick={() => setNav(false)} className="flex items-center my-3">
								<Link
									className="text-primary p-3 text-lg py-2 ml-4 hover:text-indigo-600 duration-200"
									to="/login">
									Sign In
								</Link>
							</li>
							<li onClick={() => setNav(false)} >
								<Link
									className="bg-indigo-600 border border-indigo-600 text-white px-5 py-2 ml-4 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-indigo-600 duration-200"
									to="/register">
									Sign up
								</Link>
							</li>
						</ul>
					)}
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
							<Link
								className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
								to="/admin-comments">
								Comments
							</Link>
							<Link
								className="text-primary p-4 hover:text-indigo-600 hover:scale-125 duration-200 hover:text-base"
								to="/admin-members">
								Members
							</Link>
						</>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Header;
