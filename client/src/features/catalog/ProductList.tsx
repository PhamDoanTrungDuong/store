import { Grid } from "@mui/material";
import React from "react";
import { IProduct } from "../../app/interfaces/IProduct";
import { useAppSelector } from "../../app/store/configureStore";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface IProps {
  products: IProduct[];
}

const ProductList: React.FC<IProps> = ({ products }) => {
  const {productsLoaded} = useAppSelector(state => state.catalog);
  return (
    <>
      <Grid container spacing={4}>
        {products.map((product) => {
          return (
            <Grid item xs={4} key={product.id}>
              {!productsLoaded ? (
                <ProductCardSkeleton />
              ) : (
                <ProductCard product={product} />
              )}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ProductList;
