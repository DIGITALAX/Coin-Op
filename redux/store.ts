import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import preRollReducer from "./reducers/preRollSlice";
import cartReducer from "./reducers/cartSlice";
import templateReducer from "./reducers/templateSlice";
import rollSearchReducer from "./reducers/rollSearchSlice";
import algoliaReducer from "./reducers/algoliaSlice";
import synthLayerReducer from "./reducers/synthLayerSlice";
import layerToSynthReducer from "./reducers/layerToSynthSlice";
import preRollAnimReducer from "./reducers/preRollAnimSlice";
import synthConfigReducer from "./reducers/synthConfigSlice";
import modalOpenReducer from "./reducers/modalOpenSlice";
import lensPostBoxReducer from "./reducers/lensPostBoxSlice";
import profileReducer from "./reducers/profileSlice";
import noHandleReducer from "./reducers/noHandleSlice";
import imageLoadingReducer from "./reducers/imageLoadingSlice";
import postImagesReducer from "./reducers/postImagesSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import collectValueReducer from "./reducers/collectValueSlice";
import collectOpenReducer from "./reducers/collectOpenSlice";

const reducer = combineReducers({
  preRollReducer,
  cartReducer,
  templateReducer,
  rollSearchReducer,
  algoliaReducer,
  synthLayerReducer,
  layerToSynthReducer,
  preRollAnimReducer,
  synthConfigReducer,
  modalOpenReducer,
  lensPostBoxReducer,
  profileReducer,
  noHandleReducer,
  imageLoadingReducer,
  postImagesReducer,
  indexModalReducer,
  collectValueReducer,
  collectOpenReducer
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
