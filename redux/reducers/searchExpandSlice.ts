import { PreRoll } from "@/components/Common/types/common.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchExpandState {
  value: PreRoll | undefined;
}

const initialSearchExpandState: SearchExpandState = {
  value: undefined,
};

export const searchExpandSlice = createSlice({
  name: "searchExpand",
  initialState: initialSearchExpandState,
  reducers: {
    setSearchExpand: (
      state: SearchExpandState,
      action: PayloadAction<PreRoll | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchExpand } = searchExpandSlice.actions;

export default searchExpandSlice.reducer;
