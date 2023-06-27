import { PreRoll } from "@/components/Common/types/common.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartState {
  value: PreRoll[];
}

const initialCartState: CartState = {
  value: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    setCart: (state: CartState, action: PayloadAction<PreRoll[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setCart } = cartSlice.actions;

export default cartSlice.reducer;
