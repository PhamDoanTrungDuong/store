import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import {
	Badge,
	IconButton,
	Popover,
} from "@mui/material";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";
import { AiOutlineMenu, AiOutlineClose, AiOutlineGlobal } from "react-icons/ai";
import UserNotifi from "../components/UserNotifi";
import { useTranslation } from "react-i18next";
import { locales } from "../i18n/i18n";

const Header: React.FC = () => {
	const { t, i18n } = useTranslation();
	const midLinks = [
		{ title: t("Menu_Product"), path: "/catalog" },
		{ title: t("Menu_About"), path: "/about" },
		{ title: t("Menu_Contact"), path: "/contact" },
	];
	const currentLanguage = locales[i18n.language as keyof typeof locales];
	const { basket } = useAppSelector((state) => state.basket);
	const { user } = useAppSelector((state) => state.account);
	const [nav, setNav] = useState(false);
	const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	const handleNav = () => setNav(!nav);
	const changeLanguage = (lng: any) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div className="rounded-div flex items-center justify-between h-20 font-bold">
			<div>
				<Link to="/">
					<h1 className="text-3xl font-rubik italic font-extrabold text-indigo-600">
						STORE.
					</h1>
				</Link>
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
				</>
			</div>

			<div className="flex items-center justify-between ">
				<div className="mr-3">
					<button
						className="flex justify-center items-center gap-1 hover:bg-slate-200 rounded-lg duration-200 p-2"
						onClick={handleClick}>
						<AiOutlineGlobal size={20} /> {currentLanguage}
					</button>
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}>
						<div className="flex flex-col py-2 pl-3 pr-28">
							<button
								className="py-2 hover:text-indigo-600 duration-200"
								onClick={() => {
									changeLanguage("en")
									handleClose()
								}}>
								English
							</button>
							<button
								className="py-2 hover:text-indigo-600 duration-200"
								onClick={() => {
									changeLanguage("vi")
									handleClose()
								}}>
								Tiếng Việt
							</button>
						</div>
					</Popover>
				</div>
				{!user?.roles?.includes("Admin") && (
					<div className="mr-1">
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
				<div className="hidden md:flex">
					{user ? (
						// <SignedInMenu />
						<div className="z-50 flex jutify-between items-center gap-2">
							<UserNotifi />
							<SignedInMenu />
						</div>
					) : (
						<div className="flex justify-evenly">
							<Link
								className="text-primary py-2 ml-4 hover:text-indigo-600 duration-200"
								to="/login">
								{t("Menu_SignIn")}
							</Link>
							<Link
								className="bg-indigo-600 border border-indigo-600 text-white px-5 py-2 ml-4 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-indigo-600 duration-200"
								to="/register">
								{t("Menu_SignUp")}
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
			{/* Mobile menu */}
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
									onClick={() =>
										setNav(false)
									}
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
							<li
								onClick={() => setNav(false)}
								className="flex items-center my-3">
								<Link
									className="text-primary p-3 text-lg py-2 ml-4 hover:text-indigo-600 duration-200"
									to="/login">
									Sign In
								</Link>
							</li>
							<li onClick={() => setNav(false)}>
								<Link
									className="bg-indigo-600 border border-indigo-600 text-white px-5 py-2 ml-4 rounded-lg shadow-lg hover:shadow-2xl hover:bg-transparent hover:text-indigo-600 duration-200"
									to="/register">
									Sign up
								</Link>
							</li>
						</ul>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Header;
