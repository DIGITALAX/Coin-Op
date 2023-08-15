import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SubscriptionInfoState {
  value: { email: string; firstName: string; lastName: string };
}

const initialSubscriptionInfoState: SubscriptionInfoState = {
  value: {
    email: "",
    firstName: "",
    lastName: "",
  },
};

export const subscriptionInfoSlice = createSlice({
  name: "subscriptionInfo",
  initialState: initialSubscriptionInfoState,
  reducers: {
    setSubscriptionInfo: (
      state: SubscriptionInfoState,
      action: PayloadAction<{
        email: string;
        firstName: string;
        lastName: string;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSubscriptionInfo } = subscriptionInfoSlice.actions;

export default subscriptionInfoSlice.reducer;
