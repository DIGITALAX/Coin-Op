import { createSlice } from "@reduxjs/toolkit";

export interface EncryptedInfoState {
  information: string[] | undefined;
  authSig: any;
}

const initialEncryptedInfoState: EncryptedInfoState = {
  information: undefined,
  authSig: undefined,
};

export const encryptedInfoSlice = createSlice({
  name: "encryptedInfo",
  initialState: initialEncryptedInfoState,
  reducers: {
    setEncryptedInfo: (
      state: EncryptedInfoState,
      { payload: { actionInformation, actionAuthSig } }
    ) => {
      state.information = actionInformation;
      state.authSig = actionAuthSig;
    },
  },
});

export const { setEncryptedInfo } = encryptedInfoSlice.actions;

export default encryptedInfoSlice.reducer;
