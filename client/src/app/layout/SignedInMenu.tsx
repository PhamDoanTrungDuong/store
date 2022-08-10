import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";
import { clearBasket } from "../../features/basket/basketSlice";
import { NavLink } from "react-router-dom";

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
    <>
      <Button onClick={handleClick} color="inherit" sx={{ typography: "h6" }}>
        <span className="text-zinc-900 text-base lowercase underline underline-offset-8 transition-all">
          {user?.email}
        </span>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {!user?.roles?.includes("Admin") &&
          <span>
              <MenuItem component={NavLink} to="/profile">Profile</MenuItem>
              <MenuItem component={NavLink} to="/orders">
                My orders
              </MenuItem>
          </span>
        }
        <MenuItem
          onClick={() => {
            dispatch(signOut());
            dispatch(clearBasket());
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default SignedInMenu;
