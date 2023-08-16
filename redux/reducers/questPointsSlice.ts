import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuestPointsState {
  value: number[];
}

const initialQuestPointsState: QuestPointsState = {
  value: [],
};

export const questPointsSlice = createSlice({
  name: "questPoints",
  initialState: initialQuestPointsState,
  reducers: {
    setQuestPoints: (
      state: QuestPointsState,
      action: PayloadAction<number[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setQuestPoints } = questPointsSlice.actions;

export default questPointsSlice.reducer;
