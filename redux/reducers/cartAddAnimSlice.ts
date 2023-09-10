import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartAddAnimState {
  value: string;
}

const initialCartAddAnimState: CartAddAnimState = {
  value: "",
};

export const cartAddAnimSlice = createSlice({
  name: "cartAddAnim",
  initialState: initialCartAddAnimState,
  reducers: {
    setCartAddAnim: (
      state: CartAddAnimState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCartAddAnim } = cartAddAnimSlice.actions;

export default cartAddAnimSlice.reducer;
