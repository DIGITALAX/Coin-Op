import { Layer } from "@/components/Walkthrough/Layer/types/layer.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PrintTypeLayersState {
  value: Layer[];
}

const initialPrintTypeLayersState: PrintTypeLayersState = {
  value: [],
};

export const printTypeLayersSlice = createSlice({
  name: "printTypeLayers",
  initialState: initialPrintTypeLayersState,
  reducers: {
    setPrintTypeLayers: (
      state: PrintTypeLayersState,
      action: PayloadAction<Layer[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPrintTypeLayers } = printTypeLayersSlice.actions;

export default printTypeLayersSlice.reducer;
