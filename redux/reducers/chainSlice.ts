import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Chain {
  value: number | undefined;
}

const initialChain: Chain = {
  value: undefined,
};

export const chainSlice = createSlice({
  name: "chain",
  initialState: initialChain,
  reducers: {
    setChain: (
      state: Chain,
      action: PayloadAction<number>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setChain } = chainSlice.actions;

export default chainSlice.reducer;
