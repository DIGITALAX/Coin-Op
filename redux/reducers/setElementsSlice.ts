import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SetElementsState {
  value: any[];
}

const initialSetElementsState: SetElementsState = {
  value: [],
};

export const setElementsSlice = createSlice({
  name: "setElements",
  initialState: initialSetElementsState,
  reducers: {
    setElements: (state: SetElementsState, action: PayloadAction<any[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setElements } = setElementsSlice.actions;

export default setElementsSlice.reducer;
