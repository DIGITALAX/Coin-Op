import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import preRollReducer from "./reducers/preRollSlice";
import cartReducer from "./reducers/cartSlice";
import templateReducer from "./reducers/templateSlice";
import rollSearchReducer from "./reducers/rollSearchSlice";
import algoliaReducer from "./reducers/algoliaSlice";

const reducer = combineReducers({
  preRollReducer,
  cartReducer,
  templateReducer,
  rollSearchReducer,
  algoliaReducer,
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
