import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LensPostBoxState {
  value: boolean;
}

const initialLensPostBoxState: LensPostBoxState = {
  value: false,
};

export const lensPostBoxSlice = createSlice({
  name: "lensPostBox",
  initialState: initialLensPostBoxState,
  reducers: {
    setLensPostBox: (
      state: LensPostBoxState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setLensPostBox } = lensPostBoxSlice.actions;

export default lensPostBoxSlice.reducer;
