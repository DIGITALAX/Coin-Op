import { PreRoll } from "@/components/Common/types/common.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RollSearchState {
  value: PreRoll[];
}

const initialRollSearchState: RollSearchState = {
  value: [],
};

export const rollSearchSlice = createSlice({
  name: "rollSearch",
  initialState: initialRollSearchState,
  reducers: {
    setRollSearch: (
      state: RollSearchState,
      action: PayloadAction<PreRoll[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setRollSearch } = rollSearchSlice.actions;

export default rollSearchSlice.reducer;
