import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography } from "@mui/material";
import React from "react";
import { IProduct } from "../../app/interfaces/IProduct";

interface IProps {
  product: IProduct;
}

const ProductCard: React.FC<IProps> = ({ product }) => {
  return (
    <>
      <Card>
          <CardHeader
               avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main'}}>
                         {product.name.charAt(0).toUpperCase()}
                    </Avatar>
               }
               title={product.name}
               titleTypographyProps={{ 
                    sx: { fontWeight: "bold", color: 'info.dark'}
               }}
          />
        <CardMedia
          sx={{height: 200, backgroundSize: 'contain', bgcolor: 'primary.light' }}
          image={product.pictureUrl}
          title={product.name}
        />
        <CardContent>
          <Typography gutterBottom color="secondary" variant="h5" component="div">
            ${(product.price / 100).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
               {product.brand} / {product.type}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ProductCard;
