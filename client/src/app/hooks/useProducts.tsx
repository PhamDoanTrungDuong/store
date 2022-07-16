import { useEffect } from 'react'
import { productSelector, fetchProductsAsync, fetchFiltersAsync } from '../../features/catalog/catalogSlice';
import { useAppSelector, useAppDispatch } from '../store/configureStore';

const useProducts = () => {
      const products = useAppSelector(productSelector.selectAll);
      const { productsLoaded, filtersLoaded, brands, types, productParams, pagination } =
        useAppSelector((state) => state.catalog);

      const dispatch = useAppDispatch();

      useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
      }, [dispatch, productsLoaded]);

      useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFiltersAsync());
      }, [dispatch, filtersLoaded]);

      return {
            products,
            productsLoaded,
            filtersLoaded,
            brands,
            types,
            productParams,
            pagination
      }
}

export default useProducts