import { Template } from "@/components/Walkthrough/Format/types/format.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import templates from "./../../public/items/templates.json";

export interface TemplateState {
  value: Template;
}

const initialTemplateState: TemplateState = {
  value: templates[0],
};

export const templateSlice = createSlice({
  name: "template",
  initialState: initialTemplateState,
  reducers: {
    setTemplate: (state: TemplateState, action: PayloadAction<Template>) => {
      state.value = action.payload;
    },
  },
});

export const { setTemplate } = templateSlice.actions;

export default templateSlice.reducer;
