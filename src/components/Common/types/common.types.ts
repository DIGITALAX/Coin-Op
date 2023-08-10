import { Template } from "@/components/Walkthrough/Format/types/format.types";
import {
  ElementInterface,
  SvgPatternType,
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
  WheelEvent,
} from "react";
import { AnyAction, Dispatch, Dispatch as DispatchRedux } from "redux";
import { Erc20, Profile } from "./lens.types";
import { Layer } from "@/components/Walkthrough/Layer/types/layer.types";
import { SynthData } from "../../../../redux/reducers/completedSynthsSlice";

export type PageContainerProps = {
  dispatch: DispatchRedux<AnyAction>;
  scrollToComposite: () => void;
  newLayersLoading: boolean;
  isDragging: boolean;
  apiKey: string | undefined;
  openChainModal: (() => void) | undefined;
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
  synthLayerSelected: {
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
  Print = "print",
  Hoodie = "hoodie",
  Stickers = "stickers",
  Shirt = "shirt",
}

export interface PreRoll {
  collectionId: number;
  uri: {
    image: string;
    prompt: string;
    tags: string;
    category: string;
  };
  amount: number;
  colors: string[];
  sizes: string[];
  price: number[];
  printType: string;
  bgColor: string;
  chosenColor: string;
  chosenSize: string;
  fulfillerAddress: string;
}

export interface CartItem {
  collectionId: number;
  uri: {
    image: string;
    prompt: string;
    tags: string;
    category: string;
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
};

export type SearchBoxProps = {
  promptSearch: PreRoll;
  handlePromptChoose: (e: PreRoll) => Promise<void>;
  handleSearchSimilar: (e: PreRoll) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  handleAddToCart: (e: PreRoll) => void;
  router: NextRouter;
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
};

export type ApiAddProps = {
  dispatch: DispatchRedux<AnyAction>;
};

export type HookProps = {
  preRollRef: Ref<HTMLDivElement>
}


export type HeaderProps = {
  preRollRef: Ref<HTMLDivElement>
}