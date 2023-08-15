import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CurrentPKPState {
  value:
    | {
        ethAddress: string;
        publicKey: string;
        tokenId: {
          hex: string;
          type: string;
        };
        sessionSig: any;
        pkpWallet: any;
        authSig: any;
      }
    | undefined;
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
            sessionSig: any;
            pkpWallet: any;
            authSig: any;
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
