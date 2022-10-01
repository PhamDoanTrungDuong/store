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
      <div className="mt-8 mb-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => {
          return (
            <div className="" key={product.id}>
              {!productsLoaded ? (
                <ProductCardSkeleton />
              ) : (
                <ProductCard product={product} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductList;
