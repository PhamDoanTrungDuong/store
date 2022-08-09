import * as React from "react";
import TextField from "@mui/material/TextField";
import { useFormContext } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js";
import { StripeInput } from "./StripeInput";
import { StripeElementType } from "@stripe/stripe-js";

interface IProps {
	cardState: { elementError: { [key in StripeElementType]?: string } };
	onCardInputChange: (e: any) => void;
}

const PaymentForm: React.FC<IProps> = ({ cardState, onCardInputChange }) => {
	const { control } = useFormContext();

	return (
		<>
			<h6 className="text-xl font-medium">Payment method</h6>
			<div>
				<div className="grid grid-cols-2 py-4">
					<div className="mr-2">
						<AppTextInput
							name="nameOnCard"
							label="Name on Card"
							control={control}
						/>
					</div>
					<div className="ml-2">
						<TextField
							onChange={onCardInputChange}
							error={!!cardState.elementError.cardNumber}
							helperText={
								cardState.elementError.cardNumber
							}
							id="cardNumber"
							label="Card number"
							fullWidth
							autoComplete="cc-number"
							variant="standard"
							InputLabelProps={{ shrink: true }}
							InputProps={{
								inputComponent: StripeInput,
								inputProps: {
									component: CardNumberElement,
								},
							}}
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 py-4">
					<div className="mr-2">
						<TextField
							onChange={onCardInputChange}
							error={!!cardState.elementError.cardExpiry}
							helperText={
								cardState.elementError.cardExpiry
							}
							id="expDate"
							label="Expiry date"
							fullWidth
							autoComplete="cc-exp"
							variant="standard"
							InputLabelProps={{ shrink: true }}
							InputProps={{
								inputComponent: StripeInput,
								inputProps: {
									component: CardExpiryElement,
								},
							}}
						/>
					</div>
					<div className="ml-2">
						<TextField
							onChange={onCardInputChange}
							error={!!cardState.elementError.cardCvc}
							helperText={cardState.elementError.cardCvc}
							id="cvv"
							label="CVV"
							fullWidth
							autoComplete="cc-csc"
							variant="standard"
							InputLabelProps={{ shrink: true }}
							InputProps={{
								inputComponent: StripeInput,
								inputProps: {
									component: CardCvcElement,
								},
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default PaymentForm;
