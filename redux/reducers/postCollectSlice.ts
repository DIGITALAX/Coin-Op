import { SimpleCollectOpenActionModuleInput } from "@/components/Common/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface PostCollectState {
  id?: string;
  collectTypes?: {
    [key: string]: SimpleCollectOpenActionModuleInput | undefined;
  };
}

const initialPostCollectState: PostCollectState = {
  collectTypes: {},
};

export const postCollectSlice = createSlice({
  name: "postCollect",
  initialState: initialPostCollectState,
  reducers: {
    setPostCollect: (
      state: PostCollectState,
      { payload: { actionId, actionCollectTypes } }
    ) => {
      state.id = actionId;
      state.collectTypes = actionCollectTypes;
    },
  },
});

export const { setPostCollect } = postCollectSlice.actions;

export default postCollectSlice.reducer;
