import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SynthLayerState {
  value: string[];
}

const initialSynthLayerState: SynthLayerState = {
  value: [],
};

export const synthLayerSlice = createSlice({
  name: "synthLayer",
  initialState: initialSynthLayerState,
  reducers: {
    setSynthLayer: (state: SynthLayerState, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setSynthLayer } = synthLayerSlice.actions;

export default synthLayerSlice.reducer;
