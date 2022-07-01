import React, { useEffect, useState } from "react";
import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Home from "../../features/home/Home";
import ProductDetails from "../../features/catalog/ProductDetails";
import About from "../../features/about/About";
import Basket from "../../features/basket/Basket";
import Checkout from "../../features/checkout/Checkout";
import Contact from "../../features/contact/Contact";
import Catalog from "../../features/catalog/Catalog";
import Errors from "../../features/errors/Errors";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../utilities/util";
import agent from "../api/agent";
import Loading from "./Loading";

const App: React.FC = () => {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buyerId = getCookie("buyerId");
    if (buyerId) {
      agent.Basket.get()
        .then((basket) => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setBasket]);

  const [darkMode, setDarkMode] = useState(false);

  const paletteType = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  if (loading) return <Loading message="Initialising app..." />;

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ToastContainer position="top-right" hideProgressBar />
        <CssBaseline />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/errors" element={<Errors />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="/basket" element={<Basket />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default App;
