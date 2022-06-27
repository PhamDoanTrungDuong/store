import { Grid } from "@mui/material";
import React from "react";
import { IProduct } from "../../app/interfaces/IProduct";
import ProductCard from "./ProductCard";

interface IProps {
  products: IProduct[];
}

const ProductList: React.FC<IProps> = ({ products }) => {
  return (
    <>
      <Grid container spacing={4}>
        {products.map((product) => {
          return (
            <Grid item xs={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default ProductList;
