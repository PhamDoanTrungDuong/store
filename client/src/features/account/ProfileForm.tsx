import { Box } from '@mui/material';
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form';
import AppDropzone from '../../app/components/AppDropzone';
import AppTextInput from '../../app/components/AppTextInput';
import { IUser } from '../../app/interfaces/IUser';

interface Props {
  user: IUser | null
}

const ProfileForm: React.FC<Props> = ({user}) => {
  const { control, watch, reset, formState: {isDirty}} = useFormContext();

  const watchFile = watch('file', null);

  useEffect(() => {
    if (user && !watchFile  && !isDirty) reset(user);
    return () => {
        if (watchFile) URL.revokeObjectURL(watchFile.preview);
    }
  }, [user, reset, watchFile, isDirty]);

  return (
    <div>
      <>
      <h6 className="text-xl font-medium">
        Your Profile
      </h6>
        <div>
        <div className="py-4">
            <AppTextInput control={control} name="email" label="Email" />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="phone" label="Phone Number" />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="fullName" label="Full Name" />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="address1" label="Address 1" />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="address2" label="Address 2" />
          </div>
          <div className="grid grid-cols-2 py-4">
            <div className="pr-2">
              <AppTextInput control={control} name="city" label="City" />
            </div>
            <div className="pl-2">
              <AppTextInput control={control} name="state" label="State" />
            </div>
          </div>
          <div className="grid grid-cols-2 py-4">
            <div className="pr-2">
              <AppTextInput control={control} name="zip" label="Zip" />
            </div>
            <div className="pl-2">
              <AppTextInput control={control} name="country" label="Country" />
            </div>
          </div>
          <div className="py-4">
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <AppDropzone control={control} name='file' />
                    {watchFile ? (
                        <img src={watchFile.preview} alt='preview' style={{maxHeight: 200}} />
                    ) : (
                        <img src={user?.pictureUrl} alt={user?.userName} style={{maxHeight: 200}} />
                    )}
                </Box>
          </div>
        </div>
    </>
    </div>
  )
}

export default ProfileForm