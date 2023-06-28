import { PreRoll } from "@/components/Common/types/common.types";
import { createSlice } from "@reduxjs/toolkit";
import preRolls from "./../../public/items/preRolls.json";

export interface PreRollState {
  left: PreRoll[];
  right: PreRoll[];
}

const initialPreRollState: PreRollState = {
  left: preRolls?.slice(0, Math.ceil(preRolls.length / 2)),
  right: preRolls?.slice(Math.ceil(preRolls.length / 2)),
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
