import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";
import { clearBasket } from "../../features/basket/basketSlice";
import { NavLink } from "react-router-dom";
import { googleSignOut } from "../firebase/firebase";
import agent from "../api/agent";

const SignedInMenu: React.FC = () => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.account);
	const [anchorEl, setAnchorEl] = useState<null>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className="flex gap-1 items-center max-w-[200px]">
			{user?.roles?.includes("Admin") ? (
				<img
					className="w-[20%] hover:scale-105 duration-200 mx-2 border border-gray-300 cursor-pointer rounded-full"
					src="/images/admin.jpg"
					alt={user?.username}
				/>
			) : (
				<img
					className="w-[20%] hover:scale-105 duration-200 mx-2 border border-gray-300 cursor-pointer rounded-full"
					src={
						user?.pictureUrl
							? user?.pictureUrl
							: "/images/empty-user.png"
					}
					alt={user?.username}
				/>
			)}

			<Button onClick={handleClick} color="inherit" sx={{ typography: "h6" }}>
				<span className="text-zinc-900 text-base lowercase underline underline-offset-8 transition-all">
					{user?.email}
				</span>
			</Button>
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				{!user?.roles?.includes("Admin") && (
					<span>
						<MenuItem component={NavLink} to="/profile">
							Profile
						</MenuItem>
						<MenuItem component={NavLink} to="/orders">
							My orders
						</MenuItem>
						<MenuItem component={NavLink} to="/liked-product">
							Liked Product
						</MenuItem>
						<MenuItem component={NavLink} to="/face-authen">
							Face Authentication
						</MenuItem>
						<MenuItem component={NavLink} to="/shipping-address">
							Shipping Address
						</MenuItem>
						<MenuItem component={NavLink} to="/change-pwd">
							Change password
						</MenuItem>
					</span>
				)}
				<MenuItem
					onClick={() => {
						agent.Account.memberTimerStop().then(() => {
							dispatch(signOut());
						})
						dispatch(clearBasket());
						googleSignOut()
					}}>
					Logout
				</MenuItem>
			</Menu>
		</div>
	);
};

export default SignedInMenu;
