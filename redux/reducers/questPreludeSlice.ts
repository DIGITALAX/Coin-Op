import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuestPreludeState {
  open: boolean;
}

const initialQuestPreludeState: QuestPreludeState = {
  open: false,
};

export const questPreludeSlice = createSlice({
  name: "questPrelude",
  initialState: initialQuestPreludeState,
  reducers: {
    setQuestPrelude: (
      state: QuestPreludeState,
      action: PayloadAction<boolean>
    ) => {
      state.open = action.payload;
    },
  },
});

export const { setQuestPrelude } = questPreludeSlice.actions;

export default questPreludeSlice.reducer;
