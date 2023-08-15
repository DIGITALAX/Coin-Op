import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IsSubscribedState {
  value: boolean;
}

const initialIsSubscribedState: IsSubscribedState = {
  value: false,
};

export const isSubscribedSlice = createSlice({
  name: "isSubscribed",
  initialState: initialIsSubscribedState,
  reducers: {
    setIsSubscribed: (
      state: IsSubscribedState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setIsSubscribed } = isSubscribedSlice.actions;

export default isSubscribedSlice.reducer;
