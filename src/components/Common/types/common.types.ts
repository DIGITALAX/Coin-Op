import { Template } from "@/components/Walkthrough/Format/types/format.types";
import {
  ElementInterface,
  SynthConfig,
} from "@/components/Walkthrough/Synth/types/synth.types";
import { NextRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  LegacyRef,
  MouseEvent,
  MutableRefObject,
  Ref,
  RefObject,
  SetStateAction,
} from "react";
import { AnyAction, Dispatch, Dispatch as DispatchRedux } from "redux";
import {
  ArticleMetadataV3,
  AudioMetadataV3,
  Comment,
  Erc20,
  ImageMetadataV3,
  Mirror,
  Post,
  PrimaryPublication,
  Profile,
  Quote,
  SimpleCollectOpenActionModuleInput,
  StoryMetadataV3,
  TextOnlyMetadataV3,
  VideoMetadataV3,
} from "./generated";
import { Layer } from "@/components/Walkthrough/Layer/types/layer.types";
import { SynthData } from "../../../../redux/reducers/completedSynthsSlice";
import { PostCollectState } from "../../../../redux/reducers/postCollectSlice";
import { FullScreenVideoState } from "../../../../redux/reducers/fullScreenVideoSlice";
import Draggable from "react-draggable";

export interface Details {
  name: string;
  contact: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export type PublicationProps = {
  item: Post | Comment | Quote | Mirror;
  index: number;
  disabled: boolean;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    collect: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
};

export interface MakePostComment {
  content: string | undefined;
}

export type PostCommentProps = {
  makePostComment: MakePostComment;
  caretCoord: {
    x: number;
    y: number;
  };
  postCollect: PostCollectState;
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  lensConnected: Profile | undefined;
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void;
  main?: boolean | undefined;
  itemId: string | undefined;
  commentPost:
    | ((id: string) => Promise<void>)
    | (() => Promise<void>)
    | ((id: string, main: boolean) => Promise<void>);
  commentPostLoading: boolean;
  id: string;
  height: string;
  index: number;
};

export type PostQuoteProps = {
  quote: PrimaryPublication;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  pink?: boolean;
  disabled: boolean | undefined;
};

export type PostSwitchProps = {
  dispatch: Dispatch<AnyAction>;
  item: Post | Comment | Quote | Mirror;
  disabled: boolean | undefined;
};

export type QuoteBoxProps = {
  dispatch: Dispatch<AnyAction>;
  postCollect: PostCollectState;
  quote: PrimaryPublication | undefined;
  makePost: MakePostComment[];
  post: () => Promise<void>;
  lensConnected: Profile | undefined;
  caretCoord: {
    x: number;
    y: number;
  };
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  type: string;
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  setMakePost: (e: SetStateAction<MakePostComment[]>) => void;
  postLoading: boolean[];
  router: NextRouter;
};

export type PageContainerProps = {
  dispatch: DispatchRedux<AnyAction>;
  scrollToComposite: () => void;
  newLayersLoading: boolean;
  isDragging: boolean;
  apiKey: string | undefined;
  fulfillmentDetails: Details;
  openChainModal: (() => void) | undefined;
  setCheckoutCurrency: (e: string) => void;
  openCountryDropDown: boolean;
  setOpenCountryDropDown: (e: SetStateAction<boolean>) => void;
  encrypted:
    | {
        pubId: string;
        data: string;
      }[]
    | undefined;
  startIndex: number;
  setStartIndex: (e: SetStateAction<number>) => void;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  checkoutCurrency: string;
  oracleValue: OracleData[];
  cartItem: CartItem | undefined;
  setCartItem: (e: CartItem) => void;
  handleCheckoutCrypto: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  approved: boolean;
  handleApproveSpend: () => Promise<void>;
  chain: number | undefined;
  scrollToPreroll: () => void;
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
  setEncrypted: (
    e: SetStateAction<
      | {
          pubId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
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
  encryptFulfillment: () => Promise<void>;
};

export enum PrintType {
  Poster = "poster",
  Hoodie = "hoodie",
  Sticker = "sticker",
  Shirt = "shirt",
  Sleeve = "sleeve",
}

export interface Preroll {
  collectionId: string;
  amount: string;
  pubId: string;
  uri: string;
  profileId: string;
  printType: string;
  prices: string[];
  acceptedTokens: string[];
  owner: string;
  soldTokens: string;
  fulfillerPercent: string;
  fulfillerBase: string;
  fulfiller: string;
  designerPercent: string;
  dropId: string;
  dropCollectionIds: string[];
  unlimited: boolean;
  origin: string;
  profile: Profile;
  publication: Post | undefined;
  blockTimestamp: string;
  dropMetadata: {
    dropTitle: string;
    dropCover: string;
  };
  bgColor: string;
  collectionMetadata: {
    access: string[];
    visibility: string;
    colors: string[];
    sizes: string[];
    mediaCover: string;
    description: string;
    communities: string[];
    title: string;
    tags: string[];
    prompt: string;
    mediaTypes: string[];
    profileHandle: string;
    microbrandCover: string;
    microbrand: string;
    images: string[];
    video: string;
    audio: string;
    onChromadin: string;
    sex: string;
    style: string;
  };
  currentIndex: number;
  chosenColor: string;
  chosenSize: string;
  newDrop: boolean;
}

export type TextProps = {
  metadata: ArticleMetadataV3 | StoryMetadataV3 | TextOnlyMetadataV3;
};

export type ImageProps = {
  disabled: boolean | undefined;
  dispatch: Dispatch<AnyAction>;
  metadata: ImageMetadataV3 | VideoMetadataV3 | AudioMetadataV3;
};

export type MediaProps = {
  type: string;
  srcUrl: string;
  srcCover?: string;
  classNameVideo?: string;
  classNameImage?: string;
  classNameAudio?: string;
  objectFit?: string;
  hidden?: boolean;
};

export type WaveFormProps = {
  keyValue: string;
  audio: string;
  video: string;
  type: string;
  upload?: boolean;
  handleMedia?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

export type CartItem = {
  item: Preroll;
  chosenColor: string;
  chosenSize: string;
  chosenIndex?: number;
  chosenAmount: number;
};

export type PrerollsProps = {
  left?: boolean;
  right?: boolean;
};

export type PrerollProps = {
  preroll: Preroll;
  dispatch: DispatchRedux<AnyAction>;
  cartItems: CartItem[];
  prerolls: {
    left: Preroll[];
    right: Preroll[];
  };
  left?: boolean;
  right?: boolean;
  prerollAnim: boolean;
  imageLoading: boolean;
  setImagesLoading: (e: boolean[]) => void;
  index: number;
  cartAddAnim: string;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
  }[];
};

export type PrintTagProps = {
  backgroundColor: string;
  type: string;
};

export type ColorChoiceProps = {
  dispatch: DispatchRedux<AnyAction>;
  prerolls: {
    left: Preroll[];
    right: Preroll[];
  };
  preroll: Preroll;
  left?: boolean;
  right?: boolean;
  search?: boolean;
};

export type SizingChoiceProps = {
  dispatch: DispatchRedux<AnyAction>;
  prerolls: {
    left: Preroll[];
    right: Preroll[];
  };
  preroll: Preroll;
  left?: boolean;
  right?: boolean;
  search?: boolean;
};

export type SearchBoxProps = {
  promptSearch: Preroll;
  handlePromptChoose: (e: Preroll) => Promise<void>;
  searchLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  handleAddToCart: (e: Preroll) => void;
  router: NextRouter;
  cartAddAnim: string;
};

export type RollSearchProps = {
  rollSearch: Preroll[];
  handleRollSearch: () => Promise<void>;
  prompt: string;
  setPrompt: (e: string) => void;
  handlePromptChoose: (e: Preroll) => Promise<void>;
  searchLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  handleAddToCart: (e: Preroll) => void;
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
  searchItem: Preroll;
  dispatch: DispatchRedux<AnyAction>;
  cartItems: CartItem[];
  prerolls: {
    right: Preroll[];
    left: Preroll[];
  };
  handlePromptChoose: (e: Preroll) => Promise<void>;
  router: NextRouter;
  cartAddAnim: string;
};

export type ApiAddProps = {
  dispatch: DispatchRedux<AnyAction>;
};

export type HookProps = {
  prerollRef: Ref<HTMLDivElement>;
};

export type HeaderProps = {
  prerollRef: Ref<HTMLDivElement>;
  router: NextRouter;
};

export type LoadingProps = {
  size: string;
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

export type WhoSwitchProps = {
  type: string;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  reactors: any[];
  quoters: Quote[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  mirrorQuote: boolean;
  showMore: () => void;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    collect: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
};

export type WhoProps = {
  dataLoading: boolean;
  reactors: any[];
  quoters: Quote[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  showMore: () => void;
  mirrorQuote: boolean;
  setMirrorQuote: (e: SetStateAction<boolean>) => void;
  type: string;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    collect: boolean;
  }[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
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

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}

export type InsufficientBalanceProps = {
  dispatch: Dispatch<AnyAction>;
  message: string;
};

export type InteractBarProps = {
  publication: Preroll;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
  }[];
  index: number;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
};

export type PostCollectProps = {
  dispatch: Dispatch<AnyAction>;
  id: string;
  setCollects: (
    e: SetStateAction<SimpleCollectOpenActionModuleInput | undefined>
  ) => void;
  collects: SimpleCollectOpenActionModuleInput | undefined;
  openMeasure: {
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  };
  setOpenMeasure: (
    e: SetStateAction<{
      award: string;
      whoCollectsOpen: boolean;
      creatorAwardOpen: boolean;
      currencyOpen: boolean;
      editionOpen: boolean;
      edition: string;
      timeOpen: boolean;
      time: string;
    }>
  ) => void;
  availableCurrencies: Erc20[];
  collectTypes:
    | {
        [key: string]: SimpleCollectOpenActionModuleInput | undefined;
      }
    | undefined;
};

export type PostBarProps = {
  index: number;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  mirror: (id: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    collect: boolean;
  }[];
  item: Post | Comment | Quote;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  router: NextRouter;
  disabled: boolean;
};

export type FullScreenVideoProps = {
  dispatch: Dispatch<AnyAction>;
  fullScreenVideo: FullScreenVideoState;
  videoRef: RefObject<HTMLVideoElement>;
  handlePlayPause: () => Promise<void>;
  handleSeek: (e: MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNextVideo: (forward: boolean) => Promise<void>;
  loading: {
    play: boolean;
    next: boolean;
    videos: boolean;
  };
  wrapperRef: RefObject<Draggable>;
};
