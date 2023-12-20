import { Preroll } from "@/components/Common/types/common.types";
import { createSlice } from "@reduxjs/toolkit";

export interface PrerollState {
  left: Preroll[];
  right: Preroll[];
}

const initialPrerollState: PrerollState = {
  left: [],
  right: [],
};

export const prerollSlice = createSlice({
  name: "preroll",
  initialState: initialPrerollState,
  reducers: {
    setPreroll: (
      state: PrerollState,
      { payload: { actionLeft, actionRight } }
    ) => {
      state.left = actionLeft;
      state.right = actionRight;
    },
  },
});
 
export const { setPreroll } = prerollSlice.actions;

export default prerollSlice.reducer;
