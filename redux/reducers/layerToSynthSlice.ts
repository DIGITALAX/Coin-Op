import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LayerToSynthState {
  value: string;
}

const initialLayerToSynthState: LayerToSynthState = {
  value: "",
};

export const layerToSynthSlice = createSlice({
  name: "layerToSynth",
  initialState: initialLayerToSynthState,
  reducers: {
    setLayerToSynth: (state: LayerToSynthState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setLayerToSynth } = layerToSynthSlice.actions;

export default layerToSynthSlice.reducer;
