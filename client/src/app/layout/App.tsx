import React, { useCallback, useEffect, useState } from "react";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
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
import NormalCheckoutWrapper from "../../features/checkout/NormalCheckoutWrapper";
import Footer from "./Footer";
import Profile from "../../features/account/Profile";
import AdminMembers from "../../features/admin/AdminMembers";
import AdminCategories from "../../features/admin/AdminCategories";
import AdminSlider from "../../features/admin/AdminSlider";
import AdminHome from "../../features/admin/AdminHome";
import SideBar from "../../features/admin/SideBar";
import SignedInMenu from "./SignedInMenu";
import ChangePassword from "../../features/account/ChangePassword";
import MoMoPaymentSucceeded from "../../features/checkout/MoMoPaymentSucceeded";
import AdminSales from "../../features/admin/AdminSales";
import Notifications from "../components/Notifications";
import ShippingAddress from "../../features/account/ShippingAddress";
import FaceAuthen from "../../features/account/FaceAuthen";
import PaymentConfirm from "../../features/checkout/PaymentConfirm";
import AdminPartner from "../../features/admin/AdminPartner";
import AdminDiscountBanner from "../../features/admin/AdminDiscountBanner";
import AdminVoucher from "../../features/admin/AdminVoucher";
import Shipper from "../../features/shipper/Shipper";

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
		<>
			<section className="">
				<CssBaseline />
				{/* <Header /> */}
				{user?.roles?.includes("Admin") ? (
					<>
						<div className="flex">
							<SideBar />
							<div className="h-screen relative flex-1 p-4 overflow-y-scroll bg-[#F9FAFB]">
								{user && (
									<>
										<div className="fixed top-0 left-0 w-[98%] z-40 p-6 bg-[#F9FAFB] bg-opacity-70 backdrop-blur-sm flex justify-end items-end">
											<div className="z-50 flex jutify-between items-center gap-2">
												<SignedInMenu />
												<Notifications />
											</div>
										</div>
									</>
								)}
								<Routes>
									<Route
										path="/"
										element={
											<AdminHome />
										}
									/>
								</Routes>
								<Routes>
									<Route
										path="/inventory"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<Inventory />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-sales"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminSales />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-role"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminRole />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-orders"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminOrders />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-comments"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminComment />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-members"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminMembers />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-categories"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminCategories />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-sliders"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminSlider />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-partners"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminPartner />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-vouchers"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminVoucher />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-discountBanner"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<AdminDiscountBanner />
											</PrivateRoute>
										}
									/>
									<Route
										path="/shippers"
										element={
											<PrivateRoute
												roles={[
													"Admin",
												]}>
												<Shipper />
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
					</>
				) : (
					<>
						<Header />
						<Routes>
							<Route path="/" element={<Home />} />
						</Routes>
						<div className="rounded-div mt-5 overflow-x-hidden">
							<Routes>
								<Route path="/" />
								<Route
									path="/login"
									element={<Login />}
								/>
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
								<Route
									path="/about"
									element={<About />}
								/>
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
									path="/normal-checkout"
									element={
										<PrivateRoute>
											<NormalCheckoutWrapper />
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
									path="/shipping-address"
									element={
										<PrivateRoute>
											<ShippingAddress />
										</PrivateRoute>
									}
								/>
								<Route
									path="/face-authen"
									element={
										<PrivateRoute>
											<FaceAuthen />
										</PrivateRoute>
									}
								/>
								<Route
									path="/returnUrl"
									element={
										<MoMoPaymentSucceeded />
									}
								/>
								<Route
									path="/paymentConfirm"
									element={<PaymentConfirm />}
								/>
								<Route
									path="*"
									element={<NotFound />}
								/>
							</Routes>
						</div>
						<Footer />
					</>
				)}
			</section>
		</>
	);
};

export default App;
