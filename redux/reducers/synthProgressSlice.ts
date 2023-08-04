import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SynthProgress {
  value: number;
}

const initialSynthProgress: SynthProgress = {
  value: 0,
};

export const synthProgressSlice = createSlice({
  name: "synthProgress",
  initialState: initialSynthProgress,
  reducers: {
    setSynthProgress: (state: SynthProgress, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setSynthProgress } = synthProgressSlice.actions;

export default synthProgressSlice.reducer;
