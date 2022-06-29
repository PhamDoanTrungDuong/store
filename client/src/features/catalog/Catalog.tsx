import React, { useEffect, useState } from 'react'
import agent from '../../app/api/agent';
import { IProduct } from '../../app/interfaces/IProduct'
import Loading from '../../app/layout/Loading';
import ProductList from './ProductList'

const Catalog: React.FC = () => {

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Catalog.list()
      .then(products => setProducts(products))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if(loading) return <Loading message='Loading Catalog...'/>

  return (
    <>
     <ProductList products={products} />
    </>
  )
}

export default Catalog