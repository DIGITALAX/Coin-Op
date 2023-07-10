import { Layer } from "@/components/Walkthrough/Layer/types/layer.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LayerToSynthState {
  value: string | undefined;
}

const initialLayerToSynthState: LayerToSynthState = {
  value: undefined,
};

export const layerToSynthSlice = createSlice({
  name: "layerToSynth",
  initialState: initialLayerToSynthState,
  reducers: {
    setLayerToSynth: (
      state: LayerToSynthState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setLayerToSynth } = layerToSynthSlice.actions;

export default layerToSynthSlice.reducer;
