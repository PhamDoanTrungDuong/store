import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { ICategory } from "../../app/interfaces/ICategory";

export interface AdminState {
      load: boolean;
      categories: ICategory[] | null;
}

const initialState: AdminState = {
      categories: [],
      load: false,
}

export const fetchCategories = createAsyncThunk<ICategory[]>(
      "admin/fetchCategories",
      async () => {
            try {
                  const categories = await agent.Admin.getCategories();
                  return categories;
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
      }
    },
    extraReducers(builder) {
      builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
      })
    }
})

export const {setCateLoad} = adminSlice.actions
export default adminSlice.reducer