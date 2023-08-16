import { Quest } from "@/components/Quests/types/quests.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuestInfoState {
  questInfo: Quest | undefined;
}

const initialQuestInfoState: QuestInfoState = {
  questInfo: undefined,
};

export const questInfoSlice = createSlice({
  name: "questInfo",
  initialState: initialQuestInfoState,
  reducers: {
    setQuestInfo: (
      state: QuestInfoState,
      action: PayloadAction<Quest | undefined>
    ) => {
      state.questInfo = action.payload;
    },
  },
});

export const { setQuestInfo } = questInfoSlice.actions;

export default questInfoSlice.reducer;
