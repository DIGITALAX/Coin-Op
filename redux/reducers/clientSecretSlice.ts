import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ClientSecretState {
  value: string | undefined;
}

const initialClientSecretState: ClientSecretState = {
  value: undefined,
};

export const clientSecretSlice = createSlice({
  name: "clientSecret",
  initialState: initialClientSecretState,
  reducers: {
    setClientSecret: (
      state: ClientSecretState,
      action: PayloadAction<string | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setClientSecret } = clientSecretSlice.actions;

export default clientSecretSlice.reducer;
