import { AppBar, Switch, Toolbar, Typography } from "@mui/material";
import React from "react";

interface IProps {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const Header: React.FC<IProps> = ({ darkMode, setDarkMode }) => {
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  return (
    <AppBar position="static" sx={{ mb: 4, bgcolor: "secondary.main" }}>
      <Toolbar>
        <Typography variant="h6">Store</Typography>
        <Switch onChange={handleThemeChange} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
