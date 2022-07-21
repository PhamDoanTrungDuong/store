import * as React from "react";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import BasketSumary from "../basket/BasketSumary";
import BasketTable from "../basket/BasketTable";
import { useAppSelector } from "../../app/store/configureStore";

const Review: React.FC = () => {
  const { basket } = useAppSelector((state) => state.basket);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket &&
      <BasketTable items={basket.items} isBasket={false}/>}
      <Grid container>
        <Grid item xs={12}>
          <BasketSumary />
        </Grid>
      </Grid>
    </>
  );
};

export default Review;
