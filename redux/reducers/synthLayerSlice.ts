import { Layer } from "@/components/Walkthrough/Layer/types/layer.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SynthLayerState {
  value: Layer | undefined;
}

const initialSynthLayerState: SynthLayerState = {
  value: undefined,
};

export const synthLayerSlice = createSlice({
  name: "synthLayer",
  initialState: initialSynthLayerState,
  reducers: {
    setSynthLayer: (state: SynthLayerState, action: PayloadAction<Layer>) => {
      state.value = action.payload;
    },
  },
});

export const { setSynthLayer } = synthLayerSlice.actions;

export default synthLayerSlice.reducer;
