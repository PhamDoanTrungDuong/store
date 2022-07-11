import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import { useAppDispatch } from "../../app/store/configureStore";
import agent from "../../app/api/agent";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const steps = ["Shipping address", "Review your order", "Payment details"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <Review />;
    case 2:
      return <PaymentForm />;
    default:
      throw new Error("Unknown step");
  }
}

const Checkout: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [orderNumber, setOrderNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const currentValidationSchema = validationSchema[activeStep];
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(currentValidationSchema),
  });

  useEffect(() => {
    agent.Account.fetchAddress().then((res) => {
      if (res) {
        methods.reset({ ...methods.getValues(), ...res, saveAddress: false });
      }
    });
  }, [methods]);


  const handleNext = async (data: FieldValues) => {
    const { nameOnCard, saveAddress, ...shippingAddress } = data;

    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        const orderNumber = await agent.Orders.create({
          saveAddress,
          shippingAddress,
        });
        setOrderNumber(orderNumber);
        setActiveStep(activeStep + 1);
        dispatch(clearBasket());
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <FormProvider {...methods}>
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {activeStep === steps.length ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #{orderNumber}. We have not emailed your
                  order confirmation, and will not send you an update when your
                  order has shipped as this is a fake store
                </Typography>
              </>
            ) : (
              <form onSubmit={methods.handleSubmit(handleNext)}>
                {getStepContent(activeStep)}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  <LoadingButton
                    loading={loading}
                    disabled={!methods.formState.isValid}
                    variant="contained"
                    type="submit"
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                  </LoadingButton>
                </Box>
              </form>
            )}
          </>
        </Paper>
        <Copyright />
      </Container>
    </FormProvider>
  );
};

export default Checkout;
