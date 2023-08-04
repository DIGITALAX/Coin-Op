import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CanvasSizeState {
  value: {
    width: number;
    height: number;
    oldWidth: number;
    oldHeight: number;
  };
}

const initialCanvasSizeState: CanvasSizeState = {
  value: {
    width: 0,
    height: 0,
    oldWidth: 0,
    oldHeight: 0,
  },
};

export const canvasSizeSlice = createSlice({
  name: "canvasSize",
  initialState: initialCanvasSizeState,
  reducers: {
    setCanvasSize: (
      state: CanvasSizeState,
      action: PayloadAction<{
        width: number;
        height: number;
        oldWidth: number;
        oldHeight: number;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCanvasSize } = canvasSizeSlice.actions;

export default canvasSizeSlice.reducer;
