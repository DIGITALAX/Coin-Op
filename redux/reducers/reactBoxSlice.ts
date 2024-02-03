import { createSlice } from "@reduxjs/toolkit";

export interface ReactBoxState {
  open: boolean;
  type?: string;
  id?: string;
}

const initialReactBoxState: ReactBoxState = {
  open: false,
  type: undefined,
  id: undefined,
};

export const reactBoxSlice = createSlice({
  name: "reactBox",
  initialState: initialReactBoxState,
  reducers: {
    setReactBox: (
      state: ReactBoxState,
      {
        payload: {
          actionOpen,
          actionType,

          actionId,
        },
      }
    ) => {
      state.open = actionOpen;
      state.type = actionType;
      state.id = actionId;
    },
  },
});

export const { setReactBox } = reactBoxSlice.actions;

export default reactBoxSlice.reducer;
