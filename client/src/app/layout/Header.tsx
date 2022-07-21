import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const midLinks = [
  { title: "Catalog", path: "/catalog" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
];

const navStyle = {
  color: "inherit",
  typography: "h6",
  textDecoration: "none",
  "&:hover": {
    color: "grey.400",
    transition: "0.1s ease-in-out",
  },
  "&.active": {
    color: "text.secondary",
  },
};

const Header: React.FC = () => {
  const { basket } = useAppSelector((state) => state.basket);
  const { user } = useAppSelector((state) => state.account);
  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppBar
      position="static"
      sx={{ padding: 1.5, background: "transparent", boxShadow: "none" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="h6" component={NavLink} to="/" sx={navStyle}>
            {" "}
            STORE.{" "}
          </Typography>
        </Box>
        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navStyle}>
              <span className="text-zinc-900 transition duration-150 hover:underline underline-offset-8">
                {title}
              </span>
            </ListItem>
          ))}
          {user && user.roles?.includes("Admin") && (
            <ListItem component={NavLink} to={"/inventory"} sx={navStyle}>
              <span className="text-zinc-900 transition duration-150 hover:underline underline-offset-8">
                Inventory
              </span>
            </ListItem>
          )}
        </List>

        <Box display="flex" alignItems="center">
          <IconButton
            component={NavLink}
            to="/basket"
            size="large"
            sx={{ color: "inherit" }}
          >
            <Badge badgeContent={itemCount} color="warning">
              <ShoppingCartRoundedIcon className="text-zinc-900 hover:underline underline-offset-8 transition-all" />
            </Badge>
          </IconButton>
          {user ? (
            <SignedInMenu />
          ) : (
            <List sx={{ display: "flex" }}>
              <ListItem component={NavLink} to="./login" sx={navStyle}>
                <span className="text-zinc-900 text-base hover:underline underline-offset-8 transition-all">
                  Sign in
                </span>
              </ListItem>
              <ListItem component={NavLink} to="./register" sx={navStyle}>
                <span className="text-white text-base bg-black rounded-lg w-[80px] p-[10px] hover:bg-gray transition-all">
                  Sign up
                </span>
              </ListItem>
            </List>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
