import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../app/errors/NotFound";
import Loading from "../../app/layout/Loading";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelector } from "./catalogSlice";

const ProductDetails: React.FC = () => {
  const { basket, status } = useAppSelector(state => state.basket);
  const { status: productStatus } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch()

  const { id } = useParams<{ id: any }>();
  const product = useAppSelector(state => productSelector.selectById(state, id));

  const [quantity, setQuantity] = useState(0);

  const item = basket?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    if(!product) dispatch(fetchProductAsync(+id));
  }, [id, item, dispatch, product]);

  const hanldeInputChange = (e: any) => {
    if (+e.target.value > 0 && +e.target.value <= 10) {
      setQuantity(+e.target.value);
    }
  };

  const hanldeUpdateCart = () => {
    if (!item || quantity > item.quantity) {
      const updatedQty = item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({productId: product?.id!, quantity: updatedQty}));
    } else {
      const updatedQty = item.quantity - quantity;
      dispatch(removeBasketItemAsync({productId: product?.id!, quantity: updatedQty}))
    }
  };

  if (productStatus.includes('pending')) return <Loading message="Loading Detail..." />;

  if (!product) return <NotFound />;

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <img
            src={product.pictureUrl}
            alt={product.name}
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h4">{product.name}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h4" color="secondary">
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{product.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{product.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brand</TableCell>
                  <TableCell>{product.brand}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Quantity</TableCell>
                  <TableCell>{product.quantityInStock}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={3} sx={{ marginTop: "10px" }}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                type="number"
                label="Quatity in Cart"
                fullWidth
                value={quantity}
                onChange={hanldeInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                disabled={item?.quantity === quantity || (!item && quantity === 0)}
                loading={status.includes('pending')}
                sx={{ height: "55px" }}
                color="warning"
                size="large"
                variant="contained"
                fullWidth
                onClick={hanldeUpdateCart}
              >
                {item ? "Update Quantity" : "Add to Cart"}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductDetails;
