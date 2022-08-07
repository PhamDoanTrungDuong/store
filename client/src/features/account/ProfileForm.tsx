import { Typography, Grid } from '@mui/material';
import React from 'react'
import { useFormContext } from 'react-hook-form';
import AppTextInput from '../../app/components/AppTextInput';

const ProfileForm: React.FC = () => {
  const { control } = useFormContext();

  return (
    <div>
      <>
      <Typography variant="h6" gutterBottom>
        Your Profile
      </Typography>
      <Grid container spacing={3}>
      <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="email" label="Email" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="phone" label="Phone" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="fullName" label="Full Name" />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput control={control} name="address1" label="Address 1" />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput control={control} name="address2" label="Address 2" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="city" label="City" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="state" label="State" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="zip" label="Zip" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="country" label="Country" />
          </Grid>
        </Grid>
    </>
    </div>
  )
}

export default ProfileForm