import { Typography, Grid, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../app/components/AppTextInput";
import useProducts from "../../app/hooks/useProducts";
import {yupResolver} from '@hookform/resolvers/yup';
import { validationSchema } from "./productValidation";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { IProduct } from "../../app/interfaces/IProduct";
import AppSelectList from "../../app/components/AppSelectList";
import AppSelectMultiple from "../../app/components/AppSelectMultiple";
import AppDropzone from "../../app/components/AppDropzone";
import { setProduct } from "../catalog/catalogSlice";
import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { RiBarChartBoxFill } from "react-icons/ri";
interface IProps {
    product?: IProduct;
    cancelEdit: () => void;
}

const ProductForm: React.FC<IProps> = ({ product, cancelEdit }) => {
      const { control, reset, handleSubmit, watch, formState: {isDirty, isSubmitting}  } = useForm({
            mode: 'all',
            resolver: yupResolver<any>(validationSchema)
      });

        const [colors, setColors] = useState([]);
	    const [sizes, setSizes] = useState([]);
	    const [variants, setVariants] = useState([]);
        const { brands } = useProducts();
	    const { categories } = useAppSelector((state) => state.admin);
        
        var cate = categories.map((item: any) => {return item.name});
        var colorsList = colors.map((item: any) => {return item.colour_value})
        var sizesList = sizes.map((item: any) => {return item.size_value})

        const watchFile = watch('file', null);
        const dispatch = useAppDispatch();

        useEffect(() => {
		// if (product && product.id !== undefined)
			agent.Catalog.getColors()
				.then((res) => setColors(res))
				.catch((error) => console.log(error));
            agent.Catalog.getSizes()
                .then((res) => setSizes(res))
                .catch((error) => console.log(error));
            // if(product !== undefined){
            //     agent.Catalog.productVariants(product.id) 
            //     .then((res) => setVariants(res))
            //     .catch((error) => console.log(error));
            // }    
        }, []);

        // console.log(variants)

        useEffect(() => {
            if (product && !watchFile  && !isDirty) reset(product);
            return () => {
                if (watchFile) URL.revokeObjectURL(watchFile.preview);
            }
        }, [product, reset, watchFile, isDirty]);

        async function handleSubmitData(data: FieldValues) {
            // console.log(data)
            try {
                let response: IProduct;
                if (product) {
                    data.quantityInStock = product.quantityInStock;
                    response = await agent.Admin.updateProduct(data);
                } else {
                    const cate: any = categories.find((e: any) => e.name === data.type);
                    data.currentCateId = cate.cateId;
                    data.quantityInStock = 0;
                    response = await agent.Admin.createProduct(data);
                }
                dispatch(setProduct(response));
                cancelEdit();
            } catch (error) {
                console.log(error)
            }
        }

        return (
            <div className="mt-24 p-5 rounded-div2">
                <div className="flex items-center ml-2 mt-4 mb-8">
					<Link to="/">
						<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
							<AiOutlineHome size={20} />
							Home
						</h1>
					</Link>
					<div className="mx-2">
						<IoIosArrowForward size={15} />
					</div>
					<Link to="/">
						<h1 className="flex items-center gap-1 hover:text-indigo-600 duration-200 text-lg font-rubik ">
							<RiBarChartBoxFill size={20} />
							Product Details
						</h1>
					</Link>
				</div>
                <form onSubmit={handleSubmit(handleSubmitData)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                            <AppTextInput control={control} name='name' label='Product name' />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <AppTextInput type='number' control={control} name='price' label='Price (10000 = $100.00)' />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <AppSelectList items={brands} control={control} name='brand' label='Brand' />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <AppSelectList items={cate} control={control} name='type'label='Type' />
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                            <AppTextInput type='number' control={control} name='quantityInStock' label='Quantity in Stock' />
                        </Grid> */}
                        {!product ? (
                            <>
                                <Grid item xs={12} sm={4}>
                                    {/* <AppTextInput control={control} name='colors' label='Colors (red, teal, sky, white, orange,...)' /> */}
                                    <AppSelectMultiple items={colorsList} control={control} name='colors' label='Colors' />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    {/* <AppTextInput control={control} name='size' label='Sizes (S, M, L, XL,...)' /> */}
                                    <AppSelectMultiple items={sizesList} control={control} name='sizes' label='Sizes' />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <AppTextInput control={control} name='quantity' label='Quantity for each variants (40, 50, 60)' />
                                </Grid>
                            </>
                        ) : (
                            <div></div>
                        )}
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