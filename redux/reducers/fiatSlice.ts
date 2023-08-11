import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiatState {
  value: boolean;
}

const initialFiatState: FiatState = {
  value: false,
};

export const fiatSlice = createSlice({
  name: "fiat",
  initialState: initialFiatState,
  reducers: {
    setFiat: (state: FiatState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setFiat } = fiatSlice.actions;

export default fiatSlice.reducer;
