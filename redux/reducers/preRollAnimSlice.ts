import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PrerollAnimState {
  value: boolean;
}

const initialPrerollAnimState: PrerollAnimState = {
  value: false,
};

export const prerollAnimSlice = createSlice({
  name: "prerollAnim",
  initialState: initialPrerollAnimState,
  reducers: {
    setPrerollAnim: (
      state: PrerollAnimState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPrerollAnim } = prerollAnimSlice.actions;

export default prerollAnimSlice.reducer;
