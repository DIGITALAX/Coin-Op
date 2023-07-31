import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ExpandCanvasState {
  value: boolean;
}

const initialExpandCanvasState: ExpandCanvasState = {
  value: false,
};

export const expandCanvasSlice = createSlice({
  name: "expandCanvas",
  initialState: initialExpandCanvasState,
  reducers: {
    setExpandCanvas: (state: ExpandCanvasState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setExpandCanvas } = expandCanvasSlice.actions;

export default expandCanvasSlice.reducer;
