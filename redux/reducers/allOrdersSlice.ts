import { Order } from "@/components/Account/types/account.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AllOrdersState {
  value: Order[];
}

const initialAllOrdersState: AllOrdersState = {
  value: [],
};

export const allOrdersSlice = createSlice({
  name: "allOrders",
  initialState: initialAllOrdersState,
  reducers: {
    setAllOrders: (state: AllOrdersState, action: PayloadAction<Order[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setAllOrders } = allOrdersSlice.actions;

export default allOrdersSlice.reducer;
