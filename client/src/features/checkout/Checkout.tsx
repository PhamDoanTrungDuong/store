import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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

const steps = ["Shipping address", "Review your order", "Payment details"];

const Checkout: React.FC = () => {
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
	const { basket } = useAppSelector((state) => state.basket);
	const stripe = useStripe();
	const elements = useElements();

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

	function getStepContent(step: number) {
		switch (step) {
			case 0:
				return <AddressForm />;
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

	const currentValidationSchema = validationSchema[activeStep];
	const methods = useForm({
		mode: "all",
		resolver: yupResolver(currentValidationSchema),
	});

	useEffect(() => {
		agent.Account.fetchAddress().then((res) => {
			if (res) {
				methods.reset({
					...methods.getValues(),
					...res,
					saveAddress: false,
				});
			}
		});
	}, [methods]);

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
				});
				setOrderNumber(orderNumber);
				setPaymentSucceeded(true);
				setPaymentMessage("Thank you - We have received your payment");
				setActiveStep(activeStep + 1);
				dispatch(clearBasket());
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
		<div className="rounded-div mt-5">
			<FormProvider {...methods}>
				<Container component="main" maxWidth="md" sx={{ mb: 4 }}>
					<Paper
						variant="outlined"
						sx={{
							my: { xs: 3, md: 6 },
							p: { xs: 2, md: 3 },
						}}>
						<Typography
							component="h1"
							variant="h4"
							align="center">
							Checkout
						</Typography>
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
									<Typography
										variant="h5"
										gutterBottom>
										{paymentMessage}
									</Typography>
									{paymentSucceeded ? (
										<>
										<Typography variant="subtitle1">
											Your order
											number is #
											{
												orderNumber
											}
											. We have
											not emailed
											your order
											confirmation,
											and will not
											send you an
											update when
											your order
											has shipped
											as this is a
											fake store
										</Typography>
										<div className="w-full flex justify-end ">
										<button className="mt-2 px-4 py-2 rounded-xl text-white bg-indigo-600 border border-indigo-600 hover:text-indigo-600 hover:bg-transparent duration-300">
											<Link to="/catalog">Back to Catalog</Link>
										</button>
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

export default Checkout;
