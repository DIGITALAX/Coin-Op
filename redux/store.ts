import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./reducers/pageSlice";
import preRollReducer from "./reducers/preRollSlice";

const reducer = combineReducers({
  pageReducer,
  preRollReducer
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
