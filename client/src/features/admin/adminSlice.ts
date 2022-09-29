import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { ICategory } from "../../app/interfaces/ICategory";
import { IComment } from "../../app/interfaces/IComment";
import { IOrder, OrdersParams } from "../../app/interfaces/IOrder";
import { CategoriesParams, CommentsParams } from "../../app/interfaces/IProduct";
import { RootState } from "../../app/store/configureStore";

export interface AdminState {
      load: boolean;
      loadComment: boolean;
      loadOrder: boolean;
      // categories: ICategory[] | null;
      categories: string[];
      comments: IComment[] | null;
      orders: IOrder[] | null;
      categoriesParams: CategoriesParams;
      commentsParams: CommentsParams;
      ordersParams: OrdersParams;
}

const initParams = () => {
      return {

      }
}

const initialState: AdminState = {
      categories: [],
      comments: [],
      orders: [],
      load: false,
      loadComment: false,
      loadOrder: false,
      categoriesParams: initParams(),
      commentsParams: initParams(),
      ordersParams: initParams(),
}

const getCategoriesAxiosParams = (categoriesParams: CategoriesParams) => {
      const params = new URLSearchParams();
      if(categoriesParams.searchTerm) params.append('searchTerm', categoriesParams.searchTerm);
      return params;
}

const getCommentsAxiosParams = (commentsParams: CommentsParams) => {
      const params = new URLSearchParams();
      if(commentsParams.searchTerm) params.append('searchTerm', commentsParams.searchTerm);
      return params;
}

const getOrdersAxiosParams = (ordersParams: OrdersParams) => {
      const params = new URLSearchParams();
      if(ordersParams.searchTerm) params.append('searchTerm', ordersParams.searchTerm);
      return params;
}

export const fetchCategories = createAsyncThunk<string[], void, {state: RootState}>(
      "admin/fetchCategories",
      async (_, thunkAPI) => {
            const params = getCategoriesAxiosParams(thunkAPI.getState().admin.categoriesParams);
            try {
                  const categories = await agent.Admin.getAdminCategories(params);
                  return categories;
            } catch (error: any) {
                  console.log(error);
            }
      }
)

export const fetchCommentsAsync = createAsyncThunk<IComment[], void, {state: RootState}>(
      "admin/fetchCommentsAsync",
      async (_, thunkAPI) => {
            const params = getCommentsAxiosParams(thunkAPI.getState().admin.commentsParams);
            try {
                  const comments = await agent.Admin.getComments(params);
                  return comments;
            } catch (error: any) {
                  console.log(error);
            }
      }
)

export const fetchOrdersAsync = createAsyncThunk<IOrder[], void, {state: RootState}>(
      "admin/fetchOrdersAsync",
      async (_, thunkAPI) => {
            const params = getOrdersAxiosParams(thunkAPI.getState().admin.ordersParams);
            try {
                  const orders = await agent.Admin.getOrders(params);
                  return orders;
            } catch (error: any) {
                  console.log(error);
            }
      }
)

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
      setCateLoad: (state) => {
            state.load = !state.load;
      },
      setComLoad: (state) => {
            state.loadComment = !state.loadComment;
      },
      setOrdLoad: (state) => {
            state.loadOrder = !state.loadOrder;
      },
      setCatagoriesParams: (state, action) => {
            state.categoriesParams = action.payload;
            state.load = true;
      },
      setCommentsParams: (state, action) => {
            state.commentsParams = action.payload;
            state.loadComment = true;
      },
      setOrdersParams: (state, action) => {
            state.ordersParams = action.payload;
            state.loadOrder = true;
      },
    },
    extraReducers(builder) {
      builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.load = false;
            state.categories = action.payload;
      })
      builder.addCase(fetchCommentsAsync.fulfilled, (state, action) => {
            state.loadComment = false;
            state.comments = action.payload;
      })
      builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
            state.loadOrder = false;
            state.orders = action.payload;
      })
    }
})

export const { setCateLoad, setComLoad, setOrdLoad, setCatagoriesParams, setCommentsParams, setOrdersParams } = adminSlice.actions
export default adminSlice.reducer