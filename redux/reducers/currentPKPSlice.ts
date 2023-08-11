import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CurrentPKPState {
  value:
    | {
        publicKey: string;
        tokenId: string;
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
            publicKey: string;
            tokenId: string;
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
