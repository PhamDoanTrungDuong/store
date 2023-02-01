import { IProduct, IProductDiscount, ProductParams } from "./../../app/interfaces/IProduct";
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { IPagination } from "../../app/interfaces/IPagination";
import { IComment } from "../../app/interfaces/IComment";


interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  categories: string[];
  comments: IComment[];
  productParams: ProductParams;
  pagination: IPagination | null;
  productCount: number;
  productDiscount: IProductDiscount[];
}

const productsAdapter = createEntityAdapter<IProduct>();

const getAxiosParams = (productParams: ProductParams) => {
  console.log(productParams)
  const params = new URLSearchParams();
  params.append('pageNumber', productParams.pageNumber.toString());
  params.append('pageSize', productParams.pageSize.toString());
  params.append('orderBy', productParams.orderBy);
  if(productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
  if(productParams.minPrice) params.append('minPrice', productParams.minPrice);
  if(productParams.maxPrice) params.append('maxPrice', productParams.maxPrice);
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

export const fetchProductsDiscountAsync = createAsyncThunk<IProductDiscount[], void, {state: RootState}>(
  "catalog/fetchProductsDiscountAsync",
  async (_, thunkAPI) => {
    try {
      const response = await agent.Catalog.getProductDiscount();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchCommentAsync = createAsyncThunk<IComment[], number>(
  "catalog/fetchCommentAsync",
  async (Id) => {
    try{
      return await agent.Comment.getComment(Id);
    }catch(error: any){
      console.log(error)
    }
  }
)

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

export const getProductCounterAsync = createAsyncThunk(
  "catalog/getProductCounterAsync",
  async (_ ,thunkAPI) => {
    try{
      return await agent.Catalog.getProductCount();
    }catch(error: any){
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
)

export const fetchCategoriesAsync = createAsyncThunk(
  "catalog/fetchCategoriesAsync",
  async (_ ,thunkAPI) => {
    try{
      return await agent.Admin.getCategories();
    }catch(error: any){
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
)

const initParams = () => {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: 'latest',
    brands: [],
    types: [],
    minPrice: "",
    maxPrice: "",
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
    categories: [],
    comments: [],
    productParams: initParams(),
    pagination: null,
    productCount: 0,
    productDiscount: []
  }),
  reducers: {
      setComments: (state, action) => {
        state.comments = action.payload
      },
      setPagination: (state, action) => {
        state.pagination = action.payload
      },
      setPageNumber: (state, action) => {
        state.productsLoaded = false;
        state.productParams = {...state.productParams, ...action.payload};
      },
      setProductParams: (state, action) => {
        state.productsLoaded = false;
        state.productParams = {...state.productParams, ...action.payload, pageNumber: 1};
      },
      resetProductParams: (state) => {
        state.productParams = initParams();
      },
      setProduct: (state, action) => {
        productsAdapter.upsertOne(state, action.payload);
        state.productsLoaded = false;
      },
      removeProduct: (state, action) => {
          productsAdapter.removeOne(state, action.payload);
          state.productsLoaded = false;
      },
      setProductState: (state) => {
        state.productsLoaded = false
      }
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
      state.productsLoaded = true;
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      state.status = "idle";
    });
    //Product Discount
    builder.addCase(fetchProductsDiscountAsync.pending, (state) => {
      state.status = "fetchProductsDiscountAsync";
    });
    builder.addCase(fetchProductsDiscountAsync.fulfilled, (state, action) => {
        state.productDiscount = action.payload;
        state.productsLoaded = true;
    });
    builder.addCase(fetchProductsDiscountAsync.rejected, (state) => {
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
    });

    builder.addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
      state.categories = action.payload
    });

    builder.addCase(getProductCounterAsync.fulfilled, (state, action) => {
      state.productCount = action.payload
    });

    //Product - comment
    builder.addCase(fetchCommentAsync.pending, (state) => {
      state.status = "fetchCommentAsync";
    });
    builder.addCase(fetchCommentAsync.fulfilled, (state, action) => {
      state.comments = action.payload;
      state.status = "idle";
    })
    builder.addCase(fetchCommentAsync.rejected, (state, action) => {
      state.status = "idle";
    });
  },
});

export const { setProductParams, resetProductParams, setPagination, setPageNumber, setProduct, removeProduct, setComments, setProductState} = catalogSlice.actions;
export const productSelector = productsAdapter.getSelectors(
  (state: RootState) => state.catalog
);
export default catalogSlice.reducer;
