import { PreRoll } from "@/components/Common/types/common.types";
import { createSlice } from "@reduxjs/toolkit";
import preRolls from "./../../public/preRolls/preRolls.json";

export interface PreRollState {
  left: PreRoll[];
  right: PreRoll[];
}

const initialPreRollState: PreRollState = {
  left: preRolls?.slice(0, preRolls?.length / 2),
  right: preRolls?.slice(preRolls?.length / 2, preRolls?.length),
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
