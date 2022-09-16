import React, { useCallback, useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import { Link, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Home from "../../features/home/Home";
import ProductDetails from "../../features/catalog/ProductDetails";
import About from "../../features/about/About";
import Basket from "../../features/basket/Basket";
import Contact from "../../features/contact/Contact";
import Catalog from "../../features/catalog/Catalog";
import "react-toastify/dist/ReactToastify.css";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import Loading from "./Loading";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
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
import AdminMembers from "../../features/admin/AdminMembers";
import AdminCategories from "../../features/admin/AdminCategories";
import AdminHome from "../../features/admin/AdminHome";
import SideBar from "../../features/admin/SideBar";
import SignedInMenu from "./SignedInMenu";
import ChangePassword from "../../features/account/ChangePassword";
import MoMoPaymentSucceeded from "../../features/checkout/MoMoPaymentSucceeded";
import AdminSales from "../../features/admin/AdminSales";
import Notifications from "../components/Notifications";

const App: React.FC = () => {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const { user } = useAppSelector((state) => state.account);

	const initApp = useCallback(async () => {
		try {
			if (loading) await dispatch(fetchCurrentUser());
			await dispatch(fetchBasketAsync());
		} catch (error) {
			console.log(error);
		}
	}, [dispatch, loading]);

	useEffect(() => {
		initApp().then(() => setLoading(false));
	}, [initApp]);

	if (loading) return <Loading message="Initialising app..." />;

	return (
		<section className="">
			<CssBaseline />
			{/* <Header /> */}
			{user?.roles?.includes("Admin") ? (
				<div className="flex">
					<SideBar />
					<div className="h-screen flex-1 p-4 overflow-y-scroll">
						<div className="flex justify-end items-end">
							{user ? (
								<>
								<div className="flex jutify-between items-center gap-2">
									<SignedInMenu />
									<Notifications />
								</div>
								</>
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
						<Routes>
							<Route path="/" element={<AdminHome />} />
						</Routes>
						<Routes>
							<Route
								path="/inventory"
								element={
									<PrivateRoute
										roles={["Admin"]}>
										<Inventory />
									</PrivateRoute>
								}
							/>
							<Route
								path="/admin-sales"
								element={
									<PrivateRoute
										roles={["Admin"]}>
										<AdminSales />
									</PrivateRoute>
								}
							/>
							<Route
								path="/admin-role"
								element={
									<PrivateRoute
										roles={["Admin"]}>
										<AdminRole />
									</PrivateRoute>
								}
							/>
							<Route
								path="/admin-orders"
								element={
									<PrivateRoute
										roles={["Admin"]}>
										<AdminOrders />
									</PrivateRoute>
								}
							/>
							<Route
								path="/admin-comments"
								element={
									<PrivateRoute
										roles={["Admin"]}>
										<AdminComment />
									</PrivateRoute>
								}
							/>
							<Route
								path="/admin-members"
								element={
									<PrivateRoute
										roles={["Admin"]}>
										<AdminMembers />
									</PrivateRoute>
								}
							/>
							<Route
								path="/admin-categories"
								element={
									<PrivateRoute
										roles={["Admin"]}>
										<AdminCategories />
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
						</Routes>
					</div>
				</div>
			) : (
				<>
					<Header />
					<Routes>
						<Route path="/" element={<Home />} />
					</Routes>
					<div className="rounded-div mt-5 overflow-x-hidden">
						<Routes>
							<Route path="/" />
							<Route path="/login" element={<Login />} />
							<Route
								path="/register"
								element={<Register />}
							/>
							<Route
								path="catalog"
								element={<Catalog />}
							/>
							<Route
								path="/change-pwd"
								element={<ChangePassword />}
							/>
							<Route
								path="/catalog/:id"
								element={<ProductDetails />}
							/>
							<Route path="/about" element={<About />} />
							<Route
								path="/contact"
								element={<Contact />}
							/>
							<Route
								path="/server-error"
								element={<ServerError />}
							/>
							<Route
								path="/basket"
								element={<Basket />}
							/>
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
								path="/returnUrl"
								element={<MoMoPaymentSucceeded />}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</div>
					<Footer />
				</>
			)}
		</section>
	);
};

export default App;
