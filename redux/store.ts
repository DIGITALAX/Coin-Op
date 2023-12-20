import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import prerollReducer from "./reducers/prerollSlice";
import cartReducer from "./reducers/cartSlice";
import availableCurrenciesReducer from "./reducers/availableCurrenciesSlice"; 
import templateReducer from "./reducers/templateSlice";
import rollSearchReducer from "./reducers/rollSearchSlice";
import synthLayerReducer from "./reducers/synthLayerSlice";
import layerToSynthReducer from "./reducers/layerToSynthSlice";
import prerollAnimReducer from "./reducers/prerollAnimSlice";
import synthConfigReducer from "./reducers/synthConfigSlice";
import modalOpenReducer from "./reducers/modalOpenSlice";
import profileReducer from "./reducers/profileSlice";
import noHandleReducer from "./reducers/noHandleSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import imageViewerReducer from "./reducers/imageViewerSlice";
import printTypeLayersReducer from "./reducers/printTypeLayersSlice";
import synthLoadingReducer from "./reducers/synthLoadingSlice";
import expandCanvasReducer from "./reducers/expandCanvasSlice";
import canvasSizeReducer from "./reducers/canvasSizeSlice";
import completedSynthsReducer from "./reducers/completedSynthsSlice";
import synthAreaReducer from "./reducers/synthAreaSlice";
import synthProgressReducer from "./reducers/synthProgressSlice";
import setElementsReducer from "./reducers/setElementsSlice";
import searchExpandReducer from "./reducers/searchExpandSlice";
import apiAddReducer from "./reducers/apiAddSlice";
import allOrdersReducer from "./reducers/allOrdersSlice";
import walletConnectedReducer from "./reducers/walletConnectedSlice";
import chainReducer from "./reducers/chainSlice";
import insufficientBalanceReducer from "./reducers/insufficientBalanceSlice";
import postCollectReducer from "./reducers/postCollectSlice";
import quoteBoxReducer from "./reducers/quoteBoxSlice";
import oracleDataReducer from "./reducers/oracleDataSlice";
import videoPlayerReducer from "./reducers/videoPlayerSlice";
import mainVideoReducer from "./reducers/mainVideoSlice";
import secondaryCommentReducer from "./reducers/secondaryCommentSlice";
import videoSyncReducer from "./reducers/videoSyncSlice";
import reactIdReducer from "./reducers/reactIdSlice";
import seekReducer from "./reducers/seekSlice";
import reactionStateReducer from "./reducers/reactionStateSlice";
import channelsReducer from "./reducers/channelsSlice";
import videoCountReducer from "./reducers/videoCountSlice";
import hasMoreVideoReducer from "./reducers/hasMoreVideoSlice";
import prerollsLoadingReducer from "./reducers/prerollsLoadingSlice";
import cartAddAnimReducer from "./reducers/cartAddAnimSlice";

const reducer = combineReducers({
  prerollReducer,
  quoteBoxReducer,
  cartReducer,
  templateReducer,
  rollSearchReducer,
  synthLayerReducer,
  layerToSynthReducer,
  prerollAnimReducer,
  synthConfigReducer,
  modalOpenReducer,
  profileReducer,
  noHandleReducer,
  indexModalReducer,
  insufficientBalanceReducer,
  imageViewerReducer,
  printTypeLayersReducer,
  synthLoadingReducer,
  expandCanvasReducer,
  canvasSizeReducer,
  completedSynthsReducer,
  synthAreaReducer,
  synthProgressReducer,
  setElementsReducer,
  searchExpandReducer,
  apiAddReducer,
  allOrdersReducer,
  walletConnectedReducer,
  chainReducer,
  videoPlayerReducer,
  mainVideoReducer,
  secondaryCommentReducer,
  videoSyncReducer,
  reactIdReducer,
  seekReducer,
  reactionStateReducer,
  channelsReducer,
  videoCountReducer,
  hasMoreVideoReducer,
  prerollsLoadingReducer,
  cartAddAnimReducer,
  oracleDataReducer,
  postCollectReducer,
  availableCurrenciesReducer,
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
