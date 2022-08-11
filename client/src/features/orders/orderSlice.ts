import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";

export interface OrderState {
    memberTotal: number,
    allTotal: number
}

const initialState: OrderState = {
    memberTotal: 0,
    allTotal: 0
}

export const fetchMemberTotal = createAsyncThunk<number>(
    "order/fetchMemberTotal",
    async () => {
        try {
            const subtotal = await agent.Statistisc.getTotal();
            return subtotal
        }catch(error){
            console.log(error)
        }
    }
)

export const fetchAllTotal = createAsyncThunk<number>(
    "order/fetchAllTotal",
    async () => {
        try {
            const subtotal = await agent.Statistisc.getAllTotal();
            return subtotal
        }catch(error){
            console.log(error)
        }
    }
)

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(fetchMemberTotal.fulfilled, (state, action) => {
            state.memberTotal = action.payload
        });
        builder.addCase(fetchAllTotal.fulfilled, (state, action) => {
            state.allTotal = action.payload
        });
    }
})

// export const { } = orderSlice.actions
export default orderSlice.reducer