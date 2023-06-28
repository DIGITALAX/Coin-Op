import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchIndex } from "algoliasearch";

export interface AlgoliaState {
  value: SearchIndex | undefined;
}

const initialAlgoliaState: AlgoliaState = {
  value: undefined,
};

export const algoliaSlice = createSlice({
  name: "algolia",
  initialState: initialAlgoliaState,
  reducers: {
    setAlgolia: (
      state: AlgoliaState,
      action: PayloadAction<SearchIndex | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAlgolia } = algoliaSlice.actions;

export default algoliaSlice.reducer;
