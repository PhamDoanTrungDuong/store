import * as yup from 'yup';

export const receiptValidation = yup.object({
    // price: yup.number().required().moreThan(1000),
    // quantityInStock: yup.number().required().min(0),
    imp_number: yup.number().required(),
    price: yup.number().required(),
});