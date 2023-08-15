import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ClientSecretSubState {
  value: string | undefined;
}

const initialClientSecretSubState: ClientSecretSubState = {
  value: undefined,
};

export const clientSecretSubSlice = createSlice({
  name: "clientSecretSub",
  initialState: initialClientSecretSubState,
  reducers: {
    setClientSecretSub: (
      state: ClientSecretSubState,
      action: PayloadAction<string | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setClientSecretSub } = clientSecretSubSlice.actions;

export default clientSecretSubSlice.reducer;
