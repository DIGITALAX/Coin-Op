import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SynthData {
  synths: string[];
  chosen: string;
}

export interface CompletedSynthsState {
  value: Map<string, SynthData>;
}

const initialCompletedSynthsState: CompletedSynthsState = {
  value: new Map(),
};

export const completedSynthsSlice = createSlice({
  name: "completedSynths",
  initialState: initialCompletedSynthsState,
  reducers: {
    setCompletedSynths: (
      state: CompletedSynthsState,
      action: PayloadAction<Map<string, SynthData>>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCompletedSynths } = completedSynthsSlice.actions;

export default completedSynthsSlice.reducer;
