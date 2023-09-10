import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PreRollLoadingState {
  value: boolean;
}

const initialPreRollLoadingState: PreRollLoadingState = {
  value: false,
};

export const preRollLoadingSlice = createSlice({
  name: "preRollLoading",
  initialState: initialPreRollLoadingState,
  reducers: {
    setPreRollLoading: (
      state: PreRollLoadingState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPreRollLoading } = preRollLoadingSlice.actions;

export default preRollLoadingSlice.reducer;
