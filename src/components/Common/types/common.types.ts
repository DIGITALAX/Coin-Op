import { Template } from "@/components/Walkthrough/Format/types/format.types";
import {
  ElementInterface,
  SynthConfig,
} from "@/components/Walkthrough/Synth/types/synth.types";
import { NextRouter } from "next/router";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  LegacyRef,
  MouseEvent,
  MutableRefObject,
  Ref,
  RefObject,
} from "react";
import { AnyAction, Dispatch, Dispatch as DispatchRedux } from "redux";
import { Comment, Erc20, Post, Profile } from "./generated";
import { Layer } from "@/components/Walkthrough/Layer/types/layer.types";
import { SynthData } from "../../../../redux/reducers/completedSynthsSlice";
import { MainVideoState } from "../../../../redux/reducers/mainVideoSlice";
import ReactPlayer from "react-player";
import { FollowerOnlyState } from "../../../../redux/reducers/followerOnlySlice";
import { PostCollectValuesState } from "../../../../redux/reducers/postCollectValuesSlice";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { PublicClient } from "viem";

export type PageContainerProps = {
  dispatch: DispatchRedux<AnyAction>;
  scrollToComposite: () => void;
  newLayersLoading: boolean;
  isDragging: boolean;
  apiKey: string | undefined;
  openChainModal: (() => void) | undefined;
  client: LitNodeClient;
  publicClient: PublicClient;
  chain: number | undefined;
  scrollToPreRoll: () => void;
  synthRef: Ref<HTMLDivElement>;
  materialBackground: string;
  itemClicked: boolean;
  controlType: number;
  setControlType: (e: number) => void;
  setItemClicked: (e: boolean) => void;
  setMaterialBackground: (e: string) => void;
  materialOpen: boolean;
  handleDownloadImage: (image: string) => void;
  setMaterialOpen: (e: boolean) => void;
  completedSynths: Map<string, SynthData>;
  compositeRef: LegacyRef<HTMLDivElement> | undefined;
  template: Template;
  canvasExpand: boolean;
  undo: (patternId: string) => void;
  redo: (patternId: string) => void;
  selectedElement: ElementInterface | null;
  action: string;
  writingRef: Ref<HTMLTextAreaElement>;
  handleBlur: (e: FormEvent) => void;
  handleReset: () => void;
  canvasRef: Ref<HTMLCanvasElement>;
  handleMouseDown: (e: MouseEvent) => void;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
  layerToSynth: {
    id: number;
    layer: string | undefined;
  };
  showBottomOptions: boolean;
  setShowBottomOptions: (e: boolean) => void;
  colorPicker: boolean;
  setColorPicker: (e: boolean) => void;
  hex: string;
  setHex: (e: string) => void;
  setThickness: (e: boolean) => void;
  thickness: boolean;
  setBrushWidth: (e: number) => void;
  brushWidth: number;
  tool: string;
  setTool: (e: string) => void;
  synthLayer:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPosterURI: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  shareSet: boolean;
  setShareSet: (e: boolean) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  synthConfig: SynthConfig;
  handleSynth: () => Promise<void>;
  synthLoading: boolean;
  presets: string[];
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
  address: `0x${string}` | undefined;
  models: string[];
  signInLoading: boolean;
  layersLoading: boolean;
  printTypeLayers: Layer[];
  font: string;
  setFont: (e: string) => void;
  setFontOpen: (e: boolean) => void;
  fontOpen: boolean;
};

export enum PrintType {
  Poster = "poster",
  Hoodie = "hoodie",
  Sticker = "sticker",
  Shirt = "shirt",
  Sleeve = "sleeve",
}

export interface PreRoll {
  collectionId: number;
  uri: {
    image: string[];
    prompt: string;
    tags: string[];
    category: string;
    profile: Profile;
    chromadinCollectionName?: string;
  };
  currentIndex: number;
  amount: number;
  colors: string[];
  sizes: string[];
  price: number[];
  printType: string;
  bgColor: string;
  chosenColor: string;
  chosenSize: string;
  fulfillerAddress: string;
  newDrop: boolean;
}

export interface CartItem {
  collectionId: number;
  uri: {
    image: string;
    prompt: string;
    tags: string[];
    category: string;
    profile: Profile;
    chromadinCollectionName?: string;
  };
  sizes: string[];
  price: number;
  printType: string;
  chosenColor: string;
  chosenSize: string;
  amount: number;
  fulfillerAddress: string;
}

export type PreRollsProps = {
  left?: boolean;
  right?: boolean;
};

export type PreRollProps = {
  preRoll: PreRoll;
  dispatch: DispatchRedux<AnyAction>;
  cartItems: CartItem[];
  preRolls: {
    left: PreRoll[];
    right: PreRoll[];
  };
  left?: boolean;
  right?: boolean;
  preRollAnim: boolean;
  imageLoading: boolean;
  setImagesLoading: (e: boolean[]) => void;
  index: number;
  cartAddAnim: string;
};

export type PrintTagProps = {
  backgroundColor: string;
  type: string;
};

export type ColorChoiceProps = {
  dispatch: DispatchRedux<AnyAction>;
  preRolls: {
    left: PreRoll[];
    right: PreRoll[];
  };
  preRoll: PreRoll;
  left?: boolean;
  right?: boolean;
  search?: boolean;
};

export type SizingChoiceProps = {
  dispatch: DispatchRedux<AnyAction>;
  preRolls: {
    left: PreRoll[];
    right: PreRoll[];
  };
  preRoll: PreRoll;
  left?: boolean;
  right?: boolean;
  search?: boolean;
};

export type SearchBoxProps = {
  promptSearch: PreRoll;
  handlePromptChoose: (e: PreRoll) => Promise<void>;
  handleSearchSimilar: (e: PreRoll) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  handleAddToCart: (e: PreRoll) => void;
  router: NextRouter;
  cartAddAnim: string;
};

export type RollSearchProps = {
  rollSearch: PreRoll[];
  handleRollSearch: () => Promise<void>;
  prompt: string;
  setPrompt: (e: string) => void;
  handlePromptChoose: (e: PreRoll) => Promise<void>;
  handleSearchSimilar: (e: PreRoll) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  handleAddToCart: (e: PreRoll) => void;
  router: NextRouter;
  cartAddAnim: string;
};

export type GeneralProps = {
  message: string;
  dispatch: DispatchRedux<AnyAction>;
};

export type NoHandleProps = {
  dispatch: DispatchRedux<AnyAction>;
};

export enum MediaType {
  Video,
  Image,
  Gif,
}

export interface UploadedMedia {
  cid: string;
  type: MediaType;
}

export type PostBoxProps = {
  dispatch: DispatchRedux<AnyAction>;
  postLoading: boolean;
  handlePostDescription: (e: FormEvent<Element>) => Promise<void>;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  gifOpen: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  handlePost: () => Promise<void>;
  postDescription: string;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
};

export type OptionsCommentProps = {
  videoLoading: boolean;
  imageLoading: boolean;
  commentLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  postImages: UploadedMedia[];
  dispatch: DispatchRedux<AnyAction>;
};

export type CollectButtonProps = {
  values?: string[] | Erc20[];
  col: string;
  row: string;
  openDropdown: boolean;
  handleOpenDropdown: (e: boolean) => void;
  selectValue: string | undefined;
  selectFunction: (e: string) => void;
  label: string;
  mixtape?: boolean;
};

export type CollectInputProps = {
  id: string;
  name: string;
  step?: string;
  min?: string;
  placeholder?: string;
  defaultValue?: string;
  col?: string;
  row?: string;
  label?: string;
  handleValueChange: (e: number) => void;
};

export type ImageUploadsProps = {
  handleRemoveImage: (e: UploadedMedia, feed?: boolean) => void;
  commentLoading: boolean;
  postImagesDispatched?: UploadedMedia[];
};

export interface PostImage {
  item: string;
  type: string;
  altTag: string;
}

export interface CollectValueType {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  simpleCollectModule?: {
    collectLimit: string;
    followerOnly: boolean;
  };
  revertCollectModule?: boolean;
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedTimedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  timedFeeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}

export type IndexProps = {
  message: string | undefined;
  distanceFromBottom: number;
};

export type ImageLargeProps = {
  mainImage: string;
  dispatch: DispatchRedux<AnyAction>;
};

export type MessagesProps = {
  message: string;
  dispatch: DispatchRedux<AnyAction>;
};

export type SearchExpandProps = {
  searchItem: PreRoll;
  dispatch: DispatchRedux<AnyAction>;
  cartItems: CartItem[];
  preRolls: {
    right: PreRoll[];
    left: PreRoll[];
  };
  handleSearchSimilar: (e: PreRoll) => Promise<void>;
  handlePromptChoose: (e: PreRoll) => Promise<void>;
  router: NextRouter;
  cartAddAnim: string;
};

export type ApiAddProps = {
  dispatch: DispatchRedux<AnyAction>;
};

export type HookProps = {
  preRollRef: Ref<HTMLDivElement>;
};

export type HeaderProps = {
  preRollRef: Ref<HTMLDivElement>;
  router: NextRouter
};

export type LoginProps = {
  dispatch: DispatchRedux<AnyAction>;
  openConnectModal: (() => void) | undefined;
  loginWithWeb2Auth: () => Promise<void>;
  loginLoading: boolean;
  currentPKP:
    | {
        ethAddress: string;
        publicKey: string;
        tokenId: {
          hex: string;
          type: string;
        };
      }
    | undefined;
  highlight: string | undefined;
};

export type FiatProps = {
  dispatch: DispatchRedux<AnyAction>;
};

export type QuestPreludeProps = {
  dispatch: DispatchRedux<AnyAction>;
  signUpForQuest: () => Promise<void>;
  questSignUpLoading: boolean;
  connected: boolean;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  isSubscribed: boolean | undefined;
  connectedPKP: string | undefined;
};

export interface VideoSyncState {
  duration: number;
  currentTime: number;
  heart: boolean;
  isPlaying: boolean;
  likedArray: boolean[];
  mirroredArray: boolean[];
  collectedArray: boolean[];
  videosLoading: boolean;
}

export type ComponentProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  isPlaying: boolean;
  volume: number;
  dispatchVideos: Post[];
  videoSync: VideoSyncState;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videoLoading: boolean;
  setVideoLoading: (e: boolean) => void;
};

export type PlayerProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  volume: number;
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Post[];
  videoSync: VideoSyncState;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videoLoading: boolean;
  setVideoLoading: (e: boolean) => void;
};

export type LoadingProps = {
  size: string;
};

export type FullScreenVideoProps = {
  openConnectModal: (() => void) | undefined;
  dispatch: Dispatch<AnyAction>;
  mainVideo: MainVideoState;
  videoRef: Ref<HTMLDivElement>;
  streamRef: Ref<ReactPlayer>;
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Post[];
  videoSync: VideoSyncState;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  profileId: string;
  lensProfile: Profile | undefined;
  hasMore: boolean;
  connected: boolean;
  commentors: Comment[];
  handleLensSignIn: () => Promise<void>;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videoLoading: boolean;
  setVideoLoading: (e: boolean) => void;
  handleHeart: () => void;
  collected: boolean;
  mirrored: boolean;
  liked: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  formatTime: (time: number) => string;
  collectAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
  getMorePostComments: () => Promise<void>;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  commentId: string;
  commentsOpen: boolean;
  setCommentsOpen: (e: boolean) => void;
};

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}

export type CollectModalProps = {
  message: string;
  dispatch: Dispatch<AnyAction>;
};

export type FollowerOnlyProps = {
  profile: Profile | undefined;
  followProfile: () => Promise<void>;
  followLoading: boolean;
  approved: boolean;
  approveCurrency: () => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  followDetails: FollowerOnlyState;
};

export type CollectInfoProps = {
  buttonText: string;
  symbol?: string;
  value?: string;
  limit?: string;
  time?: string;
  totalCollected?: number;
  canClick?: boolean;
  isApproved?: boolean;
  approveCurrency?: () => Promise<void>;
  handleCollect?: (id?: string) => Promise<void>;
  collectLoading: boolean;
  approvalLoading?: boolean;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
  openConnectModal: (() => void) | undefined;
  lensProfile: string | undefined;
  address: `0x${string}` | undefined;
};

export type PurchaseProps = {
  collectInfoLoading: boolean;
  approvalLoading: boolean;
  address: `0x${string}` | undefined;
  collectModuleValues: PostCollectValuesState;
  lensProfile: string;
  collectComment: (id?: any) => Promise<void>;
  collectLoading: boolean;
  approveCurrency: () => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
  dispatch: Dispatch<AnyAction>;
  openConnectModal: (() => void) | undefined;
};

export type WhoProps = {
  accounts: any[];
  fetchMore: () => Promise<void>;
  loading: boolean;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  type: number;
};

export type ControlsProps = {
  videoSync: VideoSyncState;
  formatTime: (time: number) => string;
  volume: number;
  connected: boolean;
  handleLensSignIn: () => Promise<void>;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  collected: boolean;
  mirrored: boolean;
  liked: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  profileId: string;
  mainVideo: MainVideoState;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatchVideos: Post[];
  collectAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videoLoading: boolean;
  setVideoLoading: (e: boolean) => void;
  openConnectModal: (() => void) | undefined;
};

export type CommentsProps = {
  commentors: Comment[];
  video: Post;
  getMorePostComments: () => Promise<void>;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  likeComment: (id?: string) => Promise<void>;
  collectComment: (id?: string) => Promise<void>;
  mirrorComment: (id?: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  commentId: string;
  lensProfile: Profile | undefined;
};
