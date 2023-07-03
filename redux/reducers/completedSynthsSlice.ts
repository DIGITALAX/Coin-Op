import { PreRoll } from "@/components/Common/types/common.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CompletedSynthsState {
  value: { image: string; layer: string }[];
}

const initialCompletedSynthsState: CompletedSynthsState = {
  value: [],
};

export const completedSynthsSlice = createSlice({
  name: "completedSynths",
  initialState: initialCompletedSynthsState,
  reducers: {
    setCompletedSynths: (
      state: CompletedSynthsState,
      action: PayloadAction<{ image: string; layer: string }[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCompletedSynths } = completedSynthsSlice.actions;

export default completedSynthsSlice.reducer;
