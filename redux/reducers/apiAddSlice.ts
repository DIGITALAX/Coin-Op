import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ApiAddState {
  key: string | undefined;
  open: boolean;
}

const initialApiAddState: ApiAddState = {
  key: undefined,
  open: false,
};

export const apiAddSlice = createSlice({
  name: "apiAdd",
  initialState: initialApiAddState,
  reducers: {
    setApiAdd: (state: ApiAddState, { payload: { actionKey, actionOpen } }) => {
      state.key = actionKey;
      state.open = actionOpen;
    },
  },
});

export const { setApiAdd } = apiAddSlice.actions;

export default apiAddSlice.reducer;
