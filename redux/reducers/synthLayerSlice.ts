import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SynthLayerState {
  value:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPosterURI: string;
        parentId: number;
        childId: number;
      }
    | undefined;
}

const initialSynthLayerState: SynthLayerState = {
  value: undefined,
};

export const synthLayerSlice = createSlice({
  name: "synthLayer",
  initialState: initialSynthLayerState,
  reducers: {
    setSynthLayer: (
      state: SynthLayerState,
      action: PayloadAction<
        | {
            parentURI: string;
            childTokenURIs: string[];
            parentPrice: string;
            childPrice: string;
            childPosterURI: string;
            parentId: number;
            childId: number;
          }
        | undefined
      >
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSynthLayer } = synthLayerSlice.actions;

export default synthLayerSlice.reducer;
