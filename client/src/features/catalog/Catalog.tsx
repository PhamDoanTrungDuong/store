import React, { useEffect, useState } from 'react'
import { IProduct } from '../../app/interfaces/IProduct'
import ProductList from './ProductList'


const Catalog: React.FC = () => {

  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);


  return (
    <>
     <ProductList products={products} />
    </>
  )
}

export default Catalog