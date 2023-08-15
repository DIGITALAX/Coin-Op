import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SubscriptionInfoState {
  email: string;
}

const initialSubscriptionInfoState: SubscriptionInfoState = {
  email: "",
};

export const subscriptionInfoSlice = createSlice({
  name: "subscriptionInfo",
  initialState: initialSubscriptionInfoState,
  reducers: {
    setSubscriptionInfo: (
      state: SubscriptionInfoState,
      action: PayloadAction<string>
    ) => {
      state.email = action.payload;
    },
  },
});

export const { setSubscriptionInfo } = subscriptionInfoSlice.actions;

export default subscriptionInfoSlice.reducer;
