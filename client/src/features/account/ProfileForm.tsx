import { Box } from '@mui/material';
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form';
import AppDropzone from '../../app/components/AppDropzone';
import AppTextInput from '../../app/components/AppTextInput';
import { IUser } from '../../app/interfaces/IUser';
import { useTranslation } from "react-i18next";

interface Props {
  user: IUser | null
}

const ProfileForm: React.FC<Props> = ({user}) => {
	const { t } = useTranslation();

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
        {t('Pro_YourProfile')}
        {/* <p className='text-sm text-red-600 italic font-medium'>*Please fill in the information to be able to pay with MoMo</p> */}
      </h6>
        <div>
        <div className="py-4">
            <AppTextInput control={control} name="email" label="Email" />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="phone" label={t('Pro_Phone')} />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="fullName" label={t('Pro_Fullname')} />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="address1" label={t('Pro_Addr1')} />
          </div>
          <div className="py-4">
            <AppTextInput control={control} name="address2" label={t('Pro_Addr2')} />
          </div>
          <div className="grid grid-cols-2 py-4">
            <div className="pr-2">
              <AppTextInput control={control} name="city" label={t('Pro_City')} />
            </div>
            <div className="pl-2">
              <AppTextInput control={control} name="state" label={t('Pro_State')} />
            </div>
          </div>
          <div className="grid grid-cols-2 py-4">
            <div className="pr-2">
              <AppTextInput control={control} name="zip" label="Zip" />
            </div>
            <div className="pl-2">
              <AppTextInput control={control} name="country" label={t('Pro_Country')} />
            </div>
          </div>
          <div className="py-4">
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <AppDropzone control={control} name='file' />
                    {watchFile ? (
                        <img src={watchFile.preview} alt='preview' style={{maxHeight: 200}} />
                    ) : (
                        <img src={user?.pictureUrl} alt={user?.username} style={{maxHeight: 200}} />
                    )}
                </Box>
          </div>
        </div>
    </>
    </div>
  )
}

export default ProfileForm