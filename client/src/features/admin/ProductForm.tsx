import { Typography, Grid, Box, Button } from "@mui/material";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import useProducts from "../../app/hooks/useProducts";
import {yupResolver} from '@hookform/resolvers/yup';
import { validationSchema } from "./productValidation";
import agent from "../../app/api/agent";
import { useAppDispatch } from "../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { IProduct } from "../../app/interfaces/IProduct";
import AppSelectList from "../../app/components/AppSelectList";
import AppDropzone from "../../app/components/AppDropzone";
import { setProduct } from "../catalog/catalogSlice";

interface IProps {
    product?: IProduct;
    cancelEdit: () => void;
}

const ProductForm: React.FC<IProps> = ({ product, cancelEdit }) => {
      const { control, reset, handleSubmit, watch, formState: {isDirty, isSubmitting}  } = useForm({
            mode: 'all',
            resolver: yupResolver<any>(validationSchema)
      });

        const { brands, categories } = useProducts();

        var cate = categories.map((item: any) => {return item.name});

        const watchFile = watch('file', null);
        const dispatch = useAppDispatch();

        useEffect(() => {
            if (product && !watchFile  && !isDirty) reset(product);
            return () => {
                if (watchFile) URL.revokeObjectURL(watchFile.preview);
            }
        }, [product, reset, watchFile, isDirty]);

        async function handleSubmitData(data: FieldValues) {
            try {
                let response: IProduct;
                if (product) {
                    response = await agent.Admin.updateProduct(data);
                } else {
                    const cate: any = categories.find((e: any) => e.name === data.type);
                    data.currentCateId = cate.cateId
                    response = await agent.Admin.createProduct(data);
                }
                dispatch(setProduct(response));
                cancelEdit();
            } catch (error) {
                console.log(error)
            }
        }

        return (
            <div className="rmt-5 p-5">
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                    Product Details
                </Typography>
                <form onSubmit={handleSubmit(handleSubmitData)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                            <AppTextInput control={control} name='name' label='Product name' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <AppSelectList items={brands} control={control} name='brand' label='Brand' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <AppSelectList items={cate} control={control} name='type'label='Type' />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                        <AppTextInput type='number' control={control} name='price' label='Price' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AppTextInput type='number' control={control} name='quantityInStock' label='Quantity in Stock' />
                    </Grid>
                    <Grid item xs={12}>
                        <AppTextInput multiline={true} rows={4} control={control} name='description' label='Description' />
                    </Grid>
                        <Grid item xs={12}>
                            <Box display='flex' justifyContent='space-between' alignItems='center'>
                                <AppDropzone control={control} name='file' />
                                {watchFile ? (
                                    <img src={watchFile.preview} alt='preview' style={{maxHeight: 200}} />
                                ) : (
                                    <img src={product?.pictureUrl} alt={product?.name} style={{maxHeight: 200}} />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
                        <Button onClick={cancelEdit} variant='contained' color='inherit'>Cancel</Button>
                        <LoadingButton loading={isSubmitting} type='submit' variant='contained' color='success'>Submit</LoadingButton>
                    </Box>
                </form>
            </div>
        )
}

export default ProductForm