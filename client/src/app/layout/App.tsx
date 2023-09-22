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
import AdminReceipt from "../../features/admin/AdminReceipt";
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
import LikedProduct from "../../features/catalog/LikedProduct";
import MessageComponent from "../components/MessageComponent";
import AdminMessenger from "../../features/admin/AdminMessenger";
import AdminColor from "../../features/admin/AdminColor";
import AdminSize from "../../features/admin/AdminSize";
import "../i18n/i18n";
import ProductDiscount from "../../features/home/ProductDiscount";

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
				{user?.roles?.includes("Admin") || user?.roles?.includes("Moderator") ? (
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
													"Moderator",
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
													"Moderator",
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
													"Moderator",
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
													"Moderator",
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
													"Moderator",
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
													"Moderator",
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
													"Moderator",
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
													"Moderator",
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
													"Moderator",
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
													"Moderator",
												]}>
												<AdminVoucher />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-messenger"
										element={
											<PrivateRoute
												roles={[
													"Admin",
													"Moderator",
												]}>
												<AdminMessenger />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-color"
										element={
											<PrivateRoute
												roles={[
													"Admin",
													"Moderator",
												]}>
												<AdminColor />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-size"
										element={
											<PrivateRoute
												roles={[
													"Admin",
													"Moderator",
												]}>
												<AdminSize />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-discountBanner"
										element={
											<PrivateRoute
												roles={[
													"Admin",
													"Moderator",
												]}>
												<AdminDiscountBanner />
											</PrivateRoute>
										}
									/>
									<Route
										path="/admin-receipt"
										element={
											<PrivateRoute
												roles={[
													"Admin",
													"Moderator",
												]}>
												<AdminReceipt />
											</PrivateRoute>
										}
									/>
									<Route
										path="/shippers"
										element={
											<PrivateRoute
												roles={[
													"Admin",
													"Moderator",
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
									path="/liked-product"
									element={
										<PrivateRoute>
											<LikedProduct />
										</PrivateRoute>
									}
								/>
								<Route
									path="/sale"
									element={
										<PrivateRoute>
											<ProductDiscount />
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
						{user && (
							user?.roles?.includes("Admin") || user?.roles?.includes("Moderator") ? (
								<div></div>
							) : (
								<div className="fixed right-14 bottom-10">
									<MessageComponent />
								</div>
							)
						)}
						<Footer />
					</>
				)}
			</section>
		</>
	);
};

export default App;
