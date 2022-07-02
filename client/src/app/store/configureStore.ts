import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/contact/counterSlice";
import BasketReducer from "../../features/basket/basketSlice";
import CatalogReducer from "../../features/catalog/catalogSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        basket: BasketReducer,
        catalog: CatalogReducer
    }
})

export type AppDispatch = typeof store.dispatch; 
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;