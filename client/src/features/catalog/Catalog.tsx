import {
  Grid,
  Paper,
} from "@mui/material";
import React, { useEffect } from "react";
import AppPagination from "../../app/components/AppPagination";
import CheckboxButton from "../../app/components/CheckboxButton";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  fetchFiltersAsync,
  fetchProductsAsync,
  productSelector,
  setPageNumber,
  setProductParams,
} from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to hight" },
];

const Catalog: React.FC = () => {
  const products = useAppSelector(productSelector.selectAll);
  const { productsLoaded, filtersLoaded, brands, types, productParams, pagination } =
    useAppSelector((state) => state.catalog);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync());
}, [dispatch, productsLoaded]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFiltersAsync());
  }, [dispatch, filtersLoaded]);

  if (!filtersLoaded) return <Loading message="Loading Catalog..." />;


  return (
    <Grid container columnSpacing={4} sx={{ mb: 4}}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            selectedValue={productParams.orderBy}
            options={sortOptions}
            onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButton options={brands} checked={productParams.brands} onChange={(options: string[]) => dispatch(setProductParams({brands: options}))}/>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
        <CheckboxButton options={types} checked={productParams.types} onChange={(options: string[]) => dispatch(setProductParams({types: options}))}/>
        </Paper>
      </Grid>
      <Grid item xs={9} sx={{mb: 4}}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9}>
            {pagination &&
              <AppPagination pagination={pagination} onPageChange={(page: number) => dispatch(setPageNumber({pageNumber: page}))} />
            }
      </Grid>
    </Grid>
  );
};

export default Catalog;
