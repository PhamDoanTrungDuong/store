import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";

interface IProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];

const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
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

const Header: React.FC<IProps> = ({ darkMode, setDarkMode }) => {
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  return (
    <AppBar position="static" sx={{ mb: 4, bgcolor: "primary", padding: 1.5 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display='flex' alignItems='center'>
          <Typography variant="h6" component={NavLink} to="/" sx={navStyle}>
            {" "}
            STORE{" "}
          </Typography>
          <Switch onChange={handleThemeChange} />
        </Box>
        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navStyle}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>

        <Box display='flex' alignItems='center'>
          <IconButton size="large" sx={{ color: "inherit" }}>
            <Badge badgeContent={4} color="secondary">
              <ShoppingCartRoundedIcon />
            </Badge>
          </IconButton>
          <List sx={{ display: "flex" }}>
            {rightLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyle}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
