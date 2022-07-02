import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string;
}

const initialState: CounterState = {
    data: 42,
    title: 'YARC (yet another redux counter with redux toolkit)'
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increament: (state, action) => {
            state.data += action.payload
        },
        decreament: (state, action) => {
            state.data -= action.payload
        }
    }
})

export const {increament, decreament} = counterSlice.actions
export default counterSlice.reducer