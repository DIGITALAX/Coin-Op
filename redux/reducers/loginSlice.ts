import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoginState {
  open: boolean;
}

const initialLoginState: LoginState = {
  open: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    setLogin: (state: LoginState, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

export const { setLogin } = loginSlice.actions;

export default loginSlice.reducer;
