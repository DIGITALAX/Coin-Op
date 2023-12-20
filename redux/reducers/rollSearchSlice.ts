import { Preroll } from "@/components/Common/types/common.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RollSearchState {
  value: Preroll[];
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
      action: PayloadAction<Preroll[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setRollSearch } = rollSearchSlice.actions;

export default rollSearchSlice.reducer;
