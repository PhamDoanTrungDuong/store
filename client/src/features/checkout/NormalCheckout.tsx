import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchAddresses, setStateUser } from "../account/accountSlice";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { setVoucherNull } from "../admin/adminSlice";
import { useTranslation } from "react-i18next";

const steps = ["Shipping address", "Review your order"];

const NormalCheckout: React.FC = () => {
	const { t } = useTranslation();

	const [activeStep, setActiveStep] = useState(0);
	const [orderNumber, setOrderNumber] = useState(0);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();

	const [paymentMessage, setPaymentMessage] = useState("");
	const [paymentSucceeded, setPaymentSucceeded] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<any>();

	const currentValidationSchema = validationSchema[activeStep];
	const methods = useForm({
		mode: "all",
		resolver: yupResolver(currentValidationSchema),
	});

	const { basket } = useAppSelector((state) => state.basket);
	const { selectedVoucher } = useAppSelector((state) => state.admin);

	const { status, addressState, addresses } = useAppSelector((state) => state.account);
	useEffect(() => {
		if (status === "loginSuccess") {
			Swal.fire({
				icon: "success",
				title: t("Sw_login") as string,
				showConfirmButton: false,
				timer: 1500,
			});
		}
		return () => {
			dispatch(setStateUser());
		};
	}, [dispatch, status, t]);

	// For Choose Address
	// const [addresses, setAddresses] = useState<any>([]);
	// useEffect(() => {
	// 	addressState ? dispatch(fetchAddresses()) : dispatch(fetchAddresses());
	// }, [addressState, dispatch])

	const handleSelected = (address: any): void => {
		setSelectedAddress(address);
	};

	function getStepContent(step: number) {
		switch (step) {
			case 0:
				return (
					<AddressForm
						// addresses={addresses}
						handleSelected={handleSelected}
						selectedAddress={selectedAddress}
					/>
				);
			case 1:
				return <Review />;
			default:
				throw new Error("Unknown step");
		}
	}

	useEffect(() => {
		if (selectedAddress === undefined) {
			agent.Account.fetchAddress().then((res) => {
				// console.log(methods);
				if (res) {
					methods.reset({
						...methods.getValues(),
						...res,
						saveAddress: false,
					});
				}
			});
		} else {
			methods.reset({
				...methods.getValues(),
				...selectedAddress,
				saveAddress: false,
			});
		}
	}, [methods, selectedAddress]);
	var discount = selectedVoucher.value;

	const submitOrder = async (data: FieldValues) => {
		setLoading(true);
		const { saveAddress, ...shippingAddress } = data;

		try {
			if (data !== null) {
				const orderNumber = await agent.Orders.create({
					saveAddress,
					shippingAddress,
					discount,
				});
				setOrderNumber(orderNumber);
				setPaymentSucceeded(true);
				setPaymentMessage("Thank you - We have received your payment");
				setActiveStep(activeStep + 1);
				dispatch(clearBasket());
				dispatch(setVoucherNull());
				setLoading(false);
			} else {
				setPaymentSucceeded(false);
				setLoading(false);
				setActiveStep(activeStep + 1);
			}
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const handleNext = async (data: FieldValues) => {
		if (activeStep === steps.length - 1) {
			await submitOrder(data);
		} else {
			setActiveStep(activeStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const submitDisabled = (): boolean => {
		if (activeStep === steps.length - 1) {
			return !methods.formState.isValid;
		} else {
			return !methods.formState.isValid;
		}
	};

	return (
		<div className=" mt-5">
			<FormProvider {...methods}>
				<Container component="main" maxWidth="md" sx={{ mb: 4 }}>
					<Paper
						variant="outlined"
						sx={{
							my: { xs: 3, md: 6 },
							p: { xs: 2, md: 3 },
						}}>
						<h1 className="text-3xl font-bold uppercase text-center">
							Checkout
						</h1>
						<Stepper
							activeStep={activeStep}
							sx={{ pt: 3, pb: 5 }}>
							{steps.map((label) => (
								<Step key={label}>
									<StepLabel>
										{label}
									</StepLabel>
								</Step>
							))}
						</Stepper>
						<>
							{activeStep === steps.length ? (
								<>
									<h5 className="text-xl font medium">
										{paymentMessage}
									</h5>
									{paymentSucceeded ? (
										<>
											<h1 className="text-2xl my-2">
												Your
												order
												number
												is #
												{
													orderNumber
												}
												. We
												have
												not
												emailed
												your
												order
												confirmation,
												and
												will
												not
												send
												you
												an
												update
												when
												your
												order
												has
												shipped
												as
												this
												is a
												fake
												store
											</h1>
											<div className="w-full flex justify-end ">
												<div className="flex justify-center items-center gap-2">
													<button className="mt-2 px-4 py-2 rounded-xl text-indigo-600 bg-white border border-indigo-600 hover:text-white hover:bg-indigo-600 duration-300">
														<Link
															to="/catalog"
															className="flex items-center gap-2 font-medium">
															{" "}
															<AiOutlineArrowLeft
																className="font-bold"
																size={
																	20
																}
															/>{" "}
															Back
															to
															Catalog
														</Link>
													</button>
													<button className="mt-2 px-4 py-2 rounded-xl text-white bg-indigo-600 border border-indigo-600 hover:text-indigo-600 hover:bg-transparent duration-300">
														<Link
															to="/orders"
															className="flex items-center gap-2 font-medium">
															Go
															to
															your
															Order{" "}
															<AiOutlineArrowRight
																className="font-bold"
																size={
																	20
																}
															/>
														</Link>
													</button>
												</div>
											</div>
										</>
									) : (
										<Button
											variant="contained"
											onClick={
												handleBack
											}>
											Go back and
											try again
										</Button>
									)}
								</>
							) : (
								<form
									onSubmit={methods.handleSubmit(
										handleNext
									)}>
									{getStepContent(activeStep)}
									<Box
										sx={{
											display: "flex",
											justifyContent:
												"flex-end",
										}}>
										{activeStep !==
											0 && (
											<Button
												onClick={
													handleBack
												}
												sx={{
													mt: 3,
													ml: 1,
												}}>
												Back
											</Button>
										)}
										<LoadingButton
											loading={
												loading
											}
											disabled={submitDisabled()}
											variant="contained"
											type="submit"
											sx={{
												mt: 3,
												ml: 1,
											}}>
											{activeStep ===
											steps.length -
												1
												? "Place order"
												: "Next"}
										</LoadingButton>
									</Box>
								</form>
							)}
						</>
					</Paper>
				</Container>
			</FormProvider>
		</div>
	);
};

export default NormalCheckout;
