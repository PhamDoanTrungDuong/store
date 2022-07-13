import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { useAppDispatch } from "../../app/store/configureStore";
import { setBasket } from "../basket/basketSlice";
import Checkout from "./Checkout";

const CheckoutWrapper: React.FC = () => {
  const stripePromise = loadStripe(
    "pk_test_51LKiUeGFH9bDV9w54Sn7AOLSegqXXz0iayN7KleKGLS1NbrreHMtPdjIxRsYnHltphgAZGN0FJVCn86fxc0LrgzO00sH1mAB85"
  );

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    agent.Payments.createPaymentIntent()
      .then((basket) => dispatch(setBasket(basket)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <Loading message="Loading checkout..." />;
  return (
    <>
      <Elements stripe={stripePromise}>
        <Checkout />
      </Elements>
    </>
  );
};

export default CheckoutWrapper;
