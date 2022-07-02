import React, { useEffect } from 'react'
import Loading from '../../app/layout/Loading';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { fetchProductsAsync, productSelector } from './catalogSlice';
import ProductList from './ProductList'

const Catalog: React.FC = () => {
  const products = useAppSelector(productSelector.selectAll);
  const { productsLoaded, status } = useAppSelector(state => state.catalog);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if(!productsLoaded) dispatch(fetchProductsAsync());
  }, [dispatch, productsLoaded]);

  if(status.includes('pending')) return <Loading message='Loading Catalog...'/>

  return (
    <>
     <ProductList products={products} />
    </>
  )
}

export default Catalog