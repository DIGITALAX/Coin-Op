import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PrerollLoadingState {
  value: boolean;
}

const initialPrerollLoadingState: PrerollLoadingState = {
  value: false,
};

export const prerollLoadingSlice = createSlice({
  name: "prerollLoading",
  initialState: initialPrerollLoadingState,
  reducers: {
    setPrerollLoading: (
      state: PrerollLoadingState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPrerollLoading } = prerollLoadingSlice.actions;

export default prerollLoadingSlice.reducer;
