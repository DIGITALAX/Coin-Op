import { Subscription } from "@/components/Account/types/account.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AllSubscriptionsState {
  value: Subscription | undefined;
}

const initialAllSubscriptionsState: AllSubscriptionsState = {
  value: undefined,
};

export const allSubscriptionsSlice = createSlice({
  name: "allSubscriptions",
  initialState: initialAllSubscriptionsState,
  reducers: {
    setAllSubscriptions: (
      state: AllSubscriptionsState,
      action: PayloadAction<Subscription | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAllSubscriptions } = allSubscriptionsSlice.actions;

export default allSubscriptionsSlice.reducer;
