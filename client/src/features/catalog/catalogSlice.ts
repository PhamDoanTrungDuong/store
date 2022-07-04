import { IProduct, ProductParams } from "./../../app/interfaces/IProduct";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { IPagination } from "../../app/interfaces/IPagination";


interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  pagination: IPagination | null;
}

const productsAdapter = createEntityAdapter<IProduct>();

const getAxiosParams = (productParams: ProductParams) => {
  const params = new URLSearchParams();
  params.append('pageNumber', productParams.pageNumber.toString());
  params.append('pageSize', productParams.pageSize.toString());
  params.append('orderBy', productParams.orderBy);
  if(productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
  if(productParams.brands.length > 0) params.append('brands', productParams.brands.toString());
  if(productParams.types.length > 0) params.append('types', productParams.types.toString());
  return params;
}

export const fetchProductsAsync = createAsyncThunk<IProduct[], void, {state: RootState}>(
  "catalog/fetchProductsAsync",
  async (_, thunkAPI) => {
    const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
    try {
      const response = await agent.Catalog.list(params);
      thunkAPI.dispatch(setPagination(response.pagination));
      return response.items;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchProductAsync = createAsyncThunk<IProduct, number>(
  "catalog/fetchProductAsync",
  async (productId, thunkAPI) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchFiltersAsync = createAsyncThunk(
  "catalog/fetchFilters",
  async (_ ,thunkAPI) => {
    try{
      return await agent.Catalog.fetchFilter();
    }catch(error: any){
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
)

const initParams = () => {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: 'name',
    brands: [],
    types: [],
  }
}

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState<CatalogState>({
    productsLoaded: false,
    filtersLoaded: false,
    status: "idle",
    brands: [],
    types: [],
    productParams: initParams(),
    pagination: null,
  }),
  reducers: {
      setPagination: (state, action) => {
        state.pagination = action.payload
      },
      setPageNumber: (state, action) => {
        state.productsLoaded = false;
        state.productParams = {...state.productParams, ...action.payload};
      },
      setProductParams: (state, action) => {
        console.log(action);
        state.productsLoaded = false;
        state.productParams = {...state.productParams, ...action.payload, pageNumber: 1};
      },
      resetProductParams: (state) => {
        state.productParams = initParams();
      },
  },
  extraReducers: (builder) => {
    //Products
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      state.status = "idle";
    });

    //Product details
    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchingProduct";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      state.status = "idle";
    });

    //Product Filters
    builder.addCase(fetchFiltersAsync.pending, (state) => {
      state.status = "pendingfetchFilters";
    });
    builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.status = "idle";
      state.filtersLoaded  = true;
    })
    builder.addCase(fetchFiltersAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload)
    });
  },
});

export const { setProductParams, resetProductParams, setPagination, setPageNumber} = catalogSlice.actions;
export const productSelector = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
export default catalogSlice.reducer;
