import { createSlice } from "@reduxjs/toolkit";

export interface MessagesModalState {
  open: boolean;
  message: string;
}

const initialMessagesModalState: MessagesModalState = {
  open: false,
  message: "",
};

export const messagesModalSlice = createSlice({
  name: "messagesModal",
  initialState: initialMessagesModalState,
  reducers: {
    setMessagesModal: (
      state: MessagesModalState,
      { payload: { actionOpen, actionMessage } }
    ) => {
      state.open = actionOpen;
      state.message = actionMessage;
    },
  },
});

export const { setMessagesModal } = messagesModalSlice.actions;

export default messagesModalSlice.reducer;
