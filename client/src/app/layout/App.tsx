import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
} from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Home from "../../features/home/Home";
import ProductDetails from "../../features/catalog/ProductDetails";
import About from "../../features/about/About";
import Basket from "../../features/basket/Basket";
import Contact from "../../features/contact/Contact";
import Catalog from "../../features/catalog/Catalog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import Loading from "./Loading";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import Register from "../../features/account/Register";
import Login from "../../features/account/Login";
import Orders from "../../features/orders/Orders";
import Inventory from "../../features/admin/Inventory";
import AdminRole from "../../features/admin/AdminRole";
import AdminOrders from "../../features/admin/AdminOrders";
import AdminComment from "../../features/admin/AdminComment";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import PrivateRoute from "./PrivateRoute";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Footer from "./Footer";
import Profile from "../../features/account/Profile";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);


  if (loading) return <Loading message="Initialising app..." />;

  return (
    <section className="">
        <ToastContainer position="top-right" hideProgressBar />
        <CssBaseline />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Container>
          <Routes>
            <Route path="/" />
            <Route path="catalog" element={<Catalog />} />
            <Route path="/catalog/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="/basket" element={<Basket />} />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutWrapper />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <Inventory />
                </PrivateRoute>
              }
            />
            <Route
              path="/role"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <AdminRole />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-orders"
              element={
                <PrivateRoute roles={["Admin"]}>
                <AdminOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-comments"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <AdminComment />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
        <Footer />
    </section>
  );
};

export default App;
