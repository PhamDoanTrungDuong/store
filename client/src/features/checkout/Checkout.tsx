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
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { setStateUser } from "../account/accountSlice";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { setVoucherNull } from "../admin/adminSlice";
import { useTranslation } from "react-i18next";


const Checkout: React.FC = () => {
	const { t } = useTranslation();
	const steps = [t('Check_ShippingAddr'), t('Check_Review'), t('Check_PaymentDetail')];

	const { selectedVoucher } = useAppSelector((state) => state.admin);

	const [activeStep, setActiveStep] = useState(0);
	const [orderNumber, setOrderNumber] = useState(0);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();
	const [cardState, setCardState] = useState<{
		elementError: { [key in StripeElementType]?: string };
	}>({ elementError: {} });
	const [cardComplete, setCardComplete] = useState<any>({
		cardNumber: false,
		cardExpiry: false,
		cardCvc: false,
	});
	const [paymentMessage, setPaymentMessage] = useState("");
	const [paymentSucceeded, setPaymentSucceeded] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState<any>();

	const currentValidationSchema = validationSchema[activeStep];
	const methods = useForm({
		mode: "all",
		resolver: yupResolver(currentValidationSchema),
	});

	const { basket } = useAppSelector((state) => state.basket);
	const stripe = useStripe();
	const elements = useElements();

	const { status } = useAppSelector((state) => state.account);
	useEffect(() => {
		if (status === "loginSuccess") {
			Swal.fire({
				icon: "success",
				title: t('Sw_login') as string,
				showConfirmButton: false,
				timer: 1500,
			});
		}
		return () => {
			dispatch(setStateUser());
		};
	}, [dispatch, status, t]);

	const onCardInputChange = (e: any) => {
		setCardState({
			...cardState,
			elementError: {
				...cardState.elementError,
				[e.elementType]: e.error?.message,
			},
		});
		setCardComplete({
			...cardComplete,
			[e.elementType]: e.complete,
		});
	};

	// For Choose Address
	// const [addresses, setAddresses] = useState<any>([]);
	// useEffect(() => {
	// 	agent.Account.userAddresses().then((res) => {
	// 		setAddresses(res)
	// 	})
	// }, [])

	const handleSelected = (address: any): void => {
		setSelectedAddress(address)
	}

	function getStepContent(step: number) {
		switch (step) {
			case 0:
				return <AddressForm handleSelected={handleSelected} selectedAddress={selectedAddress}/>;
			case 1:
				return <Review />;
			case 2:
				return (
					<PaymentForm
						cardState={cardState}
						onCardInputChange={onCardInputChange}
					/>
				);
			default:
				throw new Error("Unknown step");
		}
	}

	useEffect(() => {
		if(selectedAddress === undefined){
			agent.Account.fetchAddress().then((res) => {
			if (res) {
				methods.reset({
					...methods.getValues(),
					...res,
						saveAddress: false,
					});
				}
			});
		}else{
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
		const { nameOnCard, saveAddress, ...shippingAddress } = data;
		if (!stripe || !elements) return; //strip is not ready;
		try {
			const cardElement = elements.getElement(CardNumberElement);
			const paymentResult = await stripe.confirmCardPayment(
				basket?.clientSecret!,
				{
					payment_method: {
						card: cardElement!,
						billing_details: {
							name: nameOnCard,
						},
					},
				}
			);
			if (paymentResult.paymentIntent?.status === "succeeded") {
				const orderNumber = await agent.Orders.create({
					saveAddress,
					shippingAddress,
					discount
				});
				setOrderNumber(orderNumber);
				setPaymentSucceeded(true);
				setPaymentMessage("Thank you - We have received your payment");
				setActiveStep(activeStep + 1);
				dispatch(clearBasket());
				dispatch(setVoucherNull());
				setLoading(false);
			} else {
				setPaymentMessage(paymentResult.error?.message!);
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
			return (
				!cardComplete.cardCvc ||
				!cardComplete.cardExpiry ||
				!cardComplete.cardNumber ||
				!methods.formState.isValid
			);
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
							{t('Check_Checkout')}
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
												{t('Check_YourOrder')} #
												{
													orderNumber
												}
												. {t('Check_Noti')}
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
															{t('Check_BackCat')}
														</Link>
													</button>
													<button className="mt-2 px-4 py-2 rounded-xl text-white bg-indigo-600 border border-indigo-600 hover:text-indigo-600 hover:bg-transparent duration-300">
														<Link
															to="/orders"
															className="flex items-center gap-2 font-medium">
															{t('Check_GoOrder')}{" "}
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
												{t('Check_Back')}
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
												? t('Check_PlaceOrder')
												: t('Check_Next')}
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

export default Checkout;
