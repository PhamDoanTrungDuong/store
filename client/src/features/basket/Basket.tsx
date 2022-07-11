import {
  Button,
  Grid,
  Typography,
} from "@mui/material";
import BasketSumary from "./BasketSumary";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import BasketTable from "./BasketTable";

const Basket: React.FC = () => {
  const { basket } = useAppSelector(state => state.basket);

  if (!basket)
    return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
     <BasketTable items={basket.items} />
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
    </>
  );
};

export default Basket;
