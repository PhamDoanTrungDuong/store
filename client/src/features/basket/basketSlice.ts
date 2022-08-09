import { IBasket } from "./../../app/interfaces/IBasket";
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/utilities/util";

export interface BasketState {
  basket: IBasket | null;
  status: string;
}

const initialState: BasketState = {
  basket: null,
  status: 'idle'
};

export const addBasketItemAsync = createAsyncThunk<IBasket, {productId: number, quantity?: number}>(
  'basket/addBasketItemAsync',
  async ({productId, quantity = 1}, thunkAPI) => {
    try{
        return await agent.Basket.addItem(productId, quantity);
    }catch(error: any){
      return thunkAPI.rejectWithValue({error: error.data})
    }
  }
);

export const removeBasketItemAsync = createAsyncThunk<void, {productId: number, quantity: number, name?: string}>(
    'basket/removeBasketItemAsync',
    async ({productId, quantity}, thunkAPI) => {
      try{
          return await agent.Basket.removeItem(productId, quantity);
        }catch(error: any){
          return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchBasketAsync = createAsyncThunk<IBasket>(
  'basket/fetchBasketAsync',
  async (_, thunkAPI) => {
    try{
      const basket =  await agent.Basket.get();
      if(basket)
        return basket
      
    }catch(error: any){
      thunkAPI.rejectWithValue({error: error.data})
    }
  },
  {
    condition: () => {
      if(!getCookie('buyerId')) return false;
    }
  }
)

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBasket: (state, action) => {
      state.basket = action.payload;
    },
    clearBasket: (state) => {
      state.basket = null;
    },
    setStateBasket: (state) => {
      state.status = "idle";
    }
  },
  extraReducers: (builder => {
    //add Basket Item Async
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      state.status = 'pendingAddItem' + action.meta.arg.productId;
    });

    //remove Basket Item Async
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;
      const itemIndex = state.basket?.items.findIndex(
        (i) => i.productId === productId
      );
      if (itemIndex === -1 || itemIndex === undefined) return;
      state.basket!.items[itemIndex].quantity -= quantity!;
      if (state.basket!.items[itemIndex].quantity === 0)
        state.basket?.items.splice(itemIndex, 1);
      state.status = 'idle';
    });
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      state.status = 'idle';
    });

    builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled) , (state, action) => {
      state.basket = action.payload;
      state.status = 'addSuccess';
    });
    builder.addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action) => {
      state.status = 'idle';
    });
  })
});

export const { setBasket, clearBasket, setStateBasket } = basketSlice.actions;
export default basketSlice.reducer;
