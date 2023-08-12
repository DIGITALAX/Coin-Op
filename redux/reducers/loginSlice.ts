import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoginState {
  open: boolean;
  highlight: string | undefined;
}

const initialLoginState: LoginState = {
  open: false,
  highlight: undefined,
};

export const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    setLogin: (
      state: LoginState,
      { payload: { actionOpen, actionHighlight } }
    ) => {
      state.open = actionOpen;
      state.highlight = actionHighlight;
    },
  },
});

export const { setLogin } = loginSlice.actions;

export default loginSlice.reducer;
