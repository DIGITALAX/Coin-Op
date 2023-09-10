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
import imageViewerReducer from "./reducers/imageViewerSlice";
import printTypeLayersReducer from "./reducers/printTypeLayersSlice";
import messagesModalReducer from "./reducers/messagesModalSlice";
import litClientReducer from "./reducers/litClientSlice";
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
import loginReducer from "./reducers/loginSlice";
import currentPKPReducer from "./reducers/currentPKPSlice";
import paymentTypeReducer from "./reducers/paymentTypeSlice";
import encryptedInformationReducer from "./reducers/encryptedInformationSlice";
import clientSecretReducer from "./reducers/clientSecretSlice";
import fulfillmentDetailsReducer from "./reducers/fulfillmentDetailsSlice";
import questPreludeReducer from "./reducers/questPreludeSlice";
import subscriptionInfoReducer from "./reducers/subscriptionInfoSlice";
import allSubscriptionsReducer from "./reducers/allSubscriptionsSlice";
import questInfoReducer from "./reducers/questInfoSlice";
import questPointsReducer from "./reducers/questPointsSlice";
import videoPlayerReducer from "./reducers/videoPlayerSlice";
import mainVideoReducer from "./reducers/mainVideoSlice";
import secondaryCommentReducer from "./reducers/secondaryCommentSlice";
import videoSyncReducer from "./reducers/videoSyncSlice";
import canCommentReducer from "./reducers/canCommentSlice";
import reactIdReducer from "./reducers/reactIdSlice";
import approvalArgsReducer from "./reducers/approvalArgsSlice";
import seekReducer from "./reducers/seekSlice";
import dispatcherReducer from "./reducers/dispatcherSlice";
import postCollectValuesReducer from "./reducers/postCollectValuesSlice";
import purchaseReducer from "./reducers/purchaseSlice";
import authStatusReducer from "./reducers/authStatusSlice";
import reactionStateReducer from "./reducers/reactionStateSlice";
import followerOnlyReducer from "./reducers/followerOnlySlice";
import channelsReducer from "./reducers/channelsSlice";
import videoCountReducer from "./reducers/videoCountSlice";
import hasMoreVideoReducer from "./reducers/hasMoreVideoSlice";
import prerollsLoading from "./reducers/prerollsLoading";

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
  collectOpenReducer,
  imageViewerReducer,
  printTypeLayersReducer,
  messagesModalReducer,
  litClientReducer,
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
  loginReducer,
  currentPKPReducer,
  paymentTypeReducer,
  encryptedInformationReducer,
  clientSecretReducer,
  fulfillmentDetailsReducer,
  questPreludeReducer,
  subscriptionInfoReducer,
  allSubscriptionsReducer,
  questInfoReducer,
  questPointsReducer,
  videoPlayerReducer,
  mainVideoReducer,
  secondaryCommentReducer,
  canCommentReducer,
  videoSyncReducer,
  reactIdReducer,
  approvalArgsReducer,
  seekReducer,
  dispatcherReducer,
  postCollectValuesReducer,
  purchaseReducer,
  authStatusReducer,
  reactionStateReducer,
  followerOnlyReducer,
  channelsReducer,
  videoCountReducer,
  hasMoreVideoReducer,
  prerollsLoading
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
