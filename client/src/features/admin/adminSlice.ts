import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
// import { ICategory } from "../../app/interfaces/ICategory";
import { IComment } from "../../app/interfaces/IComment";
import { IOrder, OrdersParams } from "../../app/interfaces/IOrder";
import { CategoriesParams, CommentsParams } from "../../app/interfaces/IProduct";
import { RootState } from "../../app/store/configureStore";

export interface AdminState {
      load: boolean;
      loadComment: boolean;
      loadOrder: boolean;
      loadSlider: boolean;
      loadVoucher: boolean;
      loadPartner: boolean;
      loadDiscountBanner: boolean;
      loadNotify: boolean;
      // categories: ICategory[] | null;
      categories: string[];
      comments: IComment[] | null;
      orders: IOrder[] | null;
      categoriesParams: CategoriesParams;
      commentsParams: CommentsParams;
      ordersParams: OrdersParams;
      todaySales: number;
      sliders: any;
      partners: any;
      vouchers: any;
      discountBanners: any;
      selectedVoucher: any;
      notifies: any;
      bestSeller: [];
      lessInteract: [];
}

const initParams = () => {
      return {

      }
}

const initialState: AdminState = {
      categories: [],
      comments: [],
      orders: [],
      sliders: [],
      partners: [],
      vouchers: [],
      discountBanners: [],
      load: false,
      loadComment: false,
      loadOrder: false,
      loadSlider: false,
      loadPartner: false,
      loadVoucher: false,
      loadDiscountBanner: false,
      loadNotify: false,
      categoriesParams: initParams(),
      commentsParams: initParams(),
      ordersParams: initParams(),
      todaySales: 0,
      selectedVoucher: 0,
      notifies: {},
      bestSeller: [],
      lessInteract: []
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
export const fetchSliders = createAsyncThunk<any, void, {state: RootState}>(
      "admin/fetchSliders",
      async (_, thunkAPI) => {
            try {
                  const slider = await agent.Admin.getSliders();
                  return slider;
            } catch (error: any) {
                  console.log(error);
            }
      }
)
export const fetchPartners = createAsyncThunk<any, void, {state: RootState}>(
      "admin/fetchPartners",
      async (_, thunkAPI) => {
            try {
                  const partner = await agent.Admin.getPartners();
                  return partner;
            } catch (error: any) {
                  console.log(error);
            }
      }
)
export const fetchDiscountBanner = createAsyncThunk<any, void, {state: RootState}>(
      "admin/fetchDiscountBanner",
      async (_, thunkAPI) => {
            try {
                  const discountBanner = await agent.Admin.getDiscountBanner();
                  return discountBanner;
            } catch (error: any) {
                  console.log(error);
            }
      }
)
export const fetchVouchers = createAsyncThunk<any, void, {state: RootState}>(
      "admin/fetchVouchers",
      async (_, thunkAPI) => {
            try {
                  const voucher = await agent.Admin.getVouchers();
                  return voucher;
            } catch (error: any) {
                  console.log(error);
            }
      }
)
export const fetchNotifies = createAsyncThunk<any, void, {state: RootState}>(
      "admin/fetchNotifies",
      async (_, thunkAPI) => {
            try {
                  const notify = await agent.Admin.getAdminNotify();
                  return notify;
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
export const statisticsTodaySales = createAsyncThunk<number>(
      "admin/statisticsTodaySales",
      async (_, thunkAPI) => {
            try {
                  const sale = await agent.Admin.statisticToday();
                  return sale;
            } catch( error: any) {
                  console.log(error)
            }
      }
)
export const bestSellerProduct = createAsyncThunk(
      "admin/bestSellerProduct",
      async (_, thunkAPI) => {
            try {
                  return await agent.Admin.bestSeller();
            } catch( error: any) {
                  console.log(error)
            }
      }
)
export const lessInteractionProduct = createAsyncThunk(
      "admin/lessInteractionProduct",
      async (_, thunkAPI) => {
            try {
                  return await agent.Admin.lessInteraction();
            } catch( error: any) {
                  console.log(error)
            }
      }
)

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
      setSelectedVoucher: (state, action) => {
            // console.log(action.payload)
            state.selectedVoucher = action.payload;
      },
      setVoucherNull: (state) => {
            state.selectedVoucher.value = 0;
      },
      setCateLoad: (state) => {
            state.load = !state.load;
      },
      setComLoad: (state) => {
            state.loadComment = !state.loadComment;
      },
      setOrdLoad: (state) => {
            state.loadOrder = !state.loadOrder;
      },
      setSliderLoad: (state) => {
            state.loadSlider = !state.loadSlider;
      },
      setPartnerLoad: (state) => {
            state.loadPartner = !state.loadPartner;
      },
      setDiscountBannerLoad: (state) => {
            state.loadDiscountBanner = !state.loadDiscountBanner;
      },
      setVoucherLoad: (state) => {
            state.loadVoucher = !state.loadVoucher;
      },
      setNotifyLoad: (state) => {
            state.loadNotify = !state.loadNotify;
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
      builder.addCase(statisticsTodaySales.fulfilled, (state, action) => {
            state.todaySales = action.payload
      })
      builder.addCase(fetchSliders.fulfilled, (state, action) => {
            state.loadSlider = false
            state.sliders = action.payload
      })
      builder.addCase(fetchPartners.fulfilled, (state, action) => {
            state.loadPartner = false
            state.partners = action.payload
      })
      builder.addCase(fetchDiscountBanner.fulfilled, (state, action) => {
            state.loadDiscountBanner = false
            state.discountBanners = action.payload
      })
      builder.addCase(fetchVouchers.fulfilled, (state, action) => {
            state.loadVoucher = false
            state.vouchers = action.payload
      })
      builder.addCase(fetchNotifies.fulfilled, (state, action) => {
            state.loadNotify = false
            state.notifies = action.payload
      })
      builder.addCase(bestSellerProduct.fulfilled, (state, action) => {
            state.bestSeller = action.payload
      })
      builder.addCase(lessInteractionProduct.fulfilled, (state, action) => {
            state.lessInteract = action.payload
      })
    }
})

export const { setSelectedVoucher, setVoucherNull, setCateLoad, setComLoad, setOrdLoad, setSliderLoad, setPartnerLoad, setDiscountBannerLoad, setVoucherLoad, setNotifyLoad, setCatagoriesParams, setCommentsParams, setOrdersParams } = adminSlice.actions
export default adminSlice.reducer