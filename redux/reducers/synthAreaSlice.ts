import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SynthAreaState {
  value: {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
}

const initialSynthAreaState: SynthAreaState = {
  value: {
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0,
  },
};

export const synthAreaSlice = createSlice({
  name: "synthArea",
  initialState: initialSynthAreaState,
  reducers: {
    setSynthArea: (
      state: SynthAreaState,
      action: PayloadAction<{
        width: number;
        height: number;
        originalWidth: number;
        originalHeight: number;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSynthArea } = synthAreaSlice.actions;

export default synthAreaSlice.reducer;
