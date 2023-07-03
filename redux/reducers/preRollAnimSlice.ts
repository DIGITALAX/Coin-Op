import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PreRollAnimState {
  value: boolean;
}

const initialPreRollAnimState: PreRollAnimState = {
  value: false,
};

export const preRollAnimSlice = createSlice({
  name: "preRollAnim",
  initialState: initialPreRollAnimState,
  reducers: {
    setPreRollAnim: (
      state: PreRollAnimState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPreRollAnim } = preRollAnimSlice.actions;

export default preRollAnimSlice.reducer;
