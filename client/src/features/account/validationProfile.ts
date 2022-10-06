import * as yup from 'yup';

// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const validationProfile = yup.object({
      email: yup.string().required().email("Email invalid"),
      phone: yup.number().required(),
      fullName: yup.string().required(),
      address1: yup.string().required(),
      address2: yup.string().required(),
      city: yup.string().required(),
      state: yup.string().required(),
      country: yup.string().required(),
      zip: yup.number().required(),
      file: yup.mixed().when('pictureUrl', {
         is: (value: string) => !value,
         then: yup.mixed().required('Please provide an image')
      })
});
export const validationShippingAddress = yup.object({
      fullName: yup.string().required(),
      address1: yup.string().required(),
      address2: yup.string().required(),
      city: yup.string().required(),
      state: yup.string().required(),
      country: yup.string().required(),
      zip: yup.number().required(),
});