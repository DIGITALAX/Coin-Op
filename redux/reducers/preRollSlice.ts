import { PreRoll } from "@/components/Common/types/common.types";
import { createSlice } from "@reduxjs/toolkit";

export interface PreRollState {
  left: PreRoll[];
  right: PreRoll[];
}

const initialPreRollState: PreRollState = {
  left: [],
  right: [],
};

export const preRollSlice = createSlice({
  name: "preRoll",
  initialState: initialPreRollState,
  reducers: {
    setPreRoll: (
      state: PreRollState,
      { payload: { actionLeft, actionRight } }
    ) => {
      state.left = actionLeft;
      state.right = actionRight;
    },
  },
});

export const { setPreRoll } = preRollSlice.actions;

export default preRollSlice.reducer;
