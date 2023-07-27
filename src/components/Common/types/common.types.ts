import { Template } from "@/components/Walkthrough/Format/types/format.types";
import { SynthConfig } from "@/components/Walkthrough/Synth/types/synth.types";
import { NextRouter } from "next/router";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  LegacyRef,
  MutableRefObject,
  RefObject,
} from "react";
import { AnyAction, Dispatch as DispatchRedux } from "redux";
import { Erc20, Profile } from "./lens.types";
import { Layer } from "@/components/Walkthrough/Layer/types/layer.types";

export type PageContainerProps = {
  dispatch: DispatchRedux<AnyAction>;
  scrollToComposite: () => void
  compositeRef: LegacyRef<HTMLDivElement> | undefined
  template: Template;
  synthLayerSelected:
    | {
        parentURI: string;
        childURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPoster: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  synthLayer:
    | {
        parentURI: string;
        childURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPoster: string;
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
};

export enum PrintType {
  Print = "print",
  Hoodie = "hoodie",
  Stickers = "stickers",
  Shirt = "shirt",
}

export interface PreRoll {
  collectionId: number;
  uri: string;
  amount: number;
  colors: string[];
  sizes: string[];
  price: number[];
  printType: string;
  bgColor: string;
  chosenColor: string;
  chosenSize: string;
  tags: string[];
  name: string;
  fulfillerAddress: string;
}

export interface CartItem {
  collectionId: number;
  uri: string;
  price: number;
  printType: string;
  chosenColor: string;
  chosenSize: string;
  amount: number;
  name: string;
  fulfillerAddress: string;
}

export type PreRollsProps = {
  preRolls: {
    left: PreRoll[];
    right: PreRoll[];
  };
  dispatch: DispatchRedux<AnyAction>;
  cartItems: CartItem[];
  left?: boolean;
  right?: boolean;
  preRollAnim: boolean;
  preRollsLoading: boolean;
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
  printType: string
};

export type SearchBoxProps = {
  promptSearch: PreRoll;
  handlePromptChoose: (e: PreRoll) => void;
};

export type RollSearchProps = {
  rollSearch: PreRoll[];
  handleRollSearch: () => Promise<void>;
  prompt: string;
  setPrompt: (e: string) => void;
  handlePromptChoose: (e: PreRoll) => void;
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
