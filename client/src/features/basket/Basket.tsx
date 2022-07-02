import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { LoadingButton } from "@mui/lab";
import BasketSumary from "./BasketSumary";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";

const Basket: React.FC = () => {
  const { basket, status } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();

  if (!basket)
    return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Subtotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 100, marginRight: 20 }}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  ${(item.price / 100).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <LoadingButton
                    loading={
                      status === ('pendingRemoveItem' + item.productId + 'remove')
                    }
                    onClick={() => {
                      dispatch(removeBasketItemAsync({
                        productId: item.productId,
                        quantity: 1,
                        name: 'remove'
                      }));
                    }}
                    color="error"
                  >
                    <RemoveIcon />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    loading={
                      status === ('pendingAddItem' + item.productId)
                    }
                    onClick={() => {
                      dispatch(addBasketItemAsync({
                        productId: item.productId,
                        quantity: 1
                      }));
                    }}
                    color="success"
                  >
                    <AddIcon />
                  </LoadingButton>
                </TableCell>
                <TableCell align="center">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <LoadingButton
                    loading={
                      status === ('pendingRemoveItem' + item.productId + 'del')
                    }
                    onClick={() => {
                      dispatch(removeBasketItemAsync({
                        productId: item.productId,
                        quantity: item.quantity,
                        name: 'del'
                      }));
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container  sx={{marginBottom: '100px'}}>
      <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSumary />
          <Button
            component={NavLink}
            to='/checkout'
            variant='contained'
            size='large'
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Basket;
