import { Layer } from "@/components/Walkthrough/Layer/types/layer.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LayerToSynthState {
  value: {
    id: number,
    layer: string | undefined
  };
}

const initialLayerToSynthState: LayerToSynthState = {
  value: {
    id: 0,
    layer: undefined
  },
};

export const layerToSynthSlice = createSlice({
  name: "layerToSynth",
  initialState: initialLayerToSynthState,
  reducers: {
    setLayerToSynth: (
      state: LayerToSynthState,
      action: PayloadAction<{
        id: number,
        layer: string | undefined
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setLayerToSynth } = layerToSynthSlice.actions;

export default layerToSynthSlice.reducer;
