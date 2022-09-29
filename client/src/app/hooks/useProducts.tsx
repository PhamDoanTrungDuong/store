import { useEffect } from 'react'
import { fetchCategories } from '../../features/admin/adminSlice';
import { productSelector, fetchProductsAsync, fetchFiltersAsync, fetchCategoriesAsync, fetchProductsDiscountAsync } from '../../features/catalog/catalogSlice';
import { useAppSelector, useAppDispatch } from '../store/configureStore';

const useProducts = () => {
      const products = useAppSelector(productSelector.selectAll);
      const { productsLoaded, productDiscount, filtersLoaded, brands, types, categories, productParams, pagination } =
        useAppSelector((state) => state.catalog);
	    const { load } = useAppSelector((state) => state.admin);


      const dispatch = useAppDispatch();

      useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsAsync());
      }, [dispatch, productsLoaded]);

      useEffect(() => {
        if (!filtersLoaded) dispatch(fetchFiltersAsync());
      }, [dispatch, filtersLoaded]);

      useEffect(() => {
        if (!filtersLoaded) dispatch(fetchCategoriesAsync());
      }, [dispatch, filtersLoaded]);

      useEffect(() => {
        !load ? dispatch(fetchCategories()) : dispatch(fetchCategories());
      }, [dispatch, load])

      useEffect(() => {
        if (!productsLoaded) dispatch(fetchProductsDiscountAsync());
      }, [dispatch, productsLoaded]);

      return {
            products,
            productsLoaded,
            filtersLoaded,
            brands,
            types,
            categories,
            productParams,
            pagination,
            productDiscount,
      }
}

export default useProducts