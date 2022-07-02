import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { IProduct } from "../../app/interfaces/IProduct";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync } from "../basket/basketSlice";

interface IProps {
  product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
  const { status } = useAppSelector(state => state.basket);
  const dispatch = useAppDispatch();

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={product.name}
          titleTypographyProps={{
            sx: { fontWeight: "bold", color: "info.dark" },
          }}
        />
        <CardMedia
          sx={{
            height: 200,
            backgroundSize: "contain",
            bgcolor: "primary.light",
          }}
          image={product.pictureUrl}
          title={product.name}
        />
        <CardContent>
          <Typography
            gutterBottom
            color="secondary"
            variant="h5"
            component="div"
          >
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.brand} / {product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton
            loading={status.includes('pendingAddItem'+ product.id)}
            onClick={() => dispatch(addBasketItemAsync({productId: product.id}))}
            size="small"
          >
            ADD TO CARD
          </LoadingButton>
          <Button
            component={NavLink}
            to={`/catalog/${product.id}`}
            size="small"
          >
            VIEW MORE
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ProductCard;
