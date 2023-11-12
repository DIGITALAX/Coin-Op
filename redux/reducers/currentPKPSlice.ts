import { AuthSig, SessionSig } from "@lit-protocol/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PKPSig {
  ethAddress: string;
  publicKey: string;
  tokenId: {
    hex: string;
    type: string;
  };
  sessionSig: SessionSig;
  pkpWallet: any;
  authSig: AuthSig;
  encryptedToken: string;
}

export interface CurrentPKPState {
  value: PKPSig | undefined;
}

const initialCurrentPKPState: CurrentPKPState = {
  value: undefined,
};

export const currentPKPSlice = createSlice({
  name: "currentPKP",
  initialState: initialCurrentPKPState,
  reducers: {
    setCurrentPKP: (
      state: CurrentPKPState,
      action: PayloadAction<
        | {
            ethAddress: string;
            publicKey: string;
            tokenId: {
              hex: string;
              type: string;
            };
            sessionSig: SessionSig;
            pkpWallet: any;
            authSig: AuthSig;
            encryptedToken: string;
          }
        | undefined
      >
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrentPKP } = currentPKPSlice.actions;

export default currentPKPSlice.reducer;
