import { Erc20 } from "@/components/Common/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AvailableCurrenciesState {
  currencies: Erc20[];
}

const initialAvailableCurrenciesState: AvailableCurrenciesState = {
  currencies: [],
};

export const availableCurrenciesSlice = createSlice({
  name: "availableCurrencies",
  initialState: initialAvailableCurrenciesState,
  reducers: {
    setAvailableCurrencies: (
      state: AvailableCurrenciesState,
      action: PayloadAction<Erc20[]>
    ) => {
      state.currencies = action.payload;
    },
  },
});

export const { setAvailableCurrencies } = availableCurrenciesSlice.actions;

export default availableCurrenciesSlice.reducer;
