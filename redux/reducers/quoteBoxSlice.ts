import { PrimaryPublication } from "@/components/Common/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface QuoteBoxState {
  open?: boolean;
  type?: string;
  quote?: PrimaryPublication;
}

const initialQuoteBoxState: QuoteBoxState = {};

export const quoteBoxSlice = createSlice({
  name: "quoteBox",
  initialState: initialQuoteBoxState,
  reducers: {
    setQuoteBox: (
      state: QuoteBoxState,
      { payload: { actionOpen, actionQuote, actionType } }
    ) => {
      state.type = actionType;
      state.open = actionOpen;
      state.quote = actionQuote;
    },
  },
});

export const { setQuoteBox } = quoteBoxSlice.actions;

export default quoteBoxSlice.reducer;
