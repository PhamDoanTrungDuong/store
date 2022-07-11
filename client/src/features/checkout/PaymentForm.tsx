import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useFormContext } from 'react-hook-form';
import AppTextInput from '../../app/components/AppTextInput';

const PaymentForm: React.FC = () => {
  const { control } = useFormContext();

      return (
            <React.Fragment>
              <Typography variant="h6" gutterBottom>
                Payment method
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <AppTextInput name='nameOnCard' label='Name on Card' control={control} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    // required
                    id="cardNumber"
                    label="Card number"
                    fullWidth
                    autoComplete="cc-number"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    // required
                    id="expDate"
                    label="Expiry date"
                    fullWidth
                    autoComplete="cc-exp"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    // required
                    id="cvv"
                    label="CVV"
                    helperText="Last three digits on signature strip"
                    fullWidth
                    autoComplete="cc-csc"
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox color="secondary" name="saveCard" value="yes" />}
                    label="Remember credit card details for next time"
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          );
}

export default PaymentForm