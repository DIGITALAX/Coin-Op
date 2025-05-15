import { Account, Post } from "@lens-protocol/client";
import { SetStateAction } from "react";

export interface Preroll {
  collectionId: string;
  amount: string;
  uri: string;
  postId: string;
  printType: string;
  price: string;
  acceptedTokens: string[];
  designer: string;
  tokenIdsMinted: string[];
  dropId: string;
  unlimited: boolean;
  origin: string;
  profile: Account;
  publication: Post | undefined;
  blockTimestamp: string;
  drop: {
    metadata: {
      title: string;
      cover: string;
    };
  };
  bgColor: string;
  metadata: {
    access: string[];
    visibility: string;
    colors: string[];
    sizes: string[];
    mediaCover: string;
    description: string;
    title: string;
    tags: string[];
    prompt: string;
    mediaTypes: string[];
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

export type PrerollProps = {
  preroll: Preroll;
  dict: any;
  left?: boolean;
  right?: boolean;
  index: number;
  imageLoading: boolean;
  setImagesLoading: (e: SetStateAction<boolean[]>) => void;
};

export type PrintTagProps = {
  backgroundColor: string;
  type: string;
  dict: any;
};

export type ColorChoiceProps = {
  preroll: Preroll;
  left?: boolean;
  right?: boolean;
  search?: boolean;
};

export type SizingChoiceProps = {
  preroll: Preroll;
  left?: boolean;
  right?: boolean;
  search?: boolean;
};

export type CartItem = {
  item: Preroll;
  chosenColor: string;
  chosenSize: string;
  chosenAmount: number;
};

export type InteractBarProps = {
  dict: any;
  preroll: Preroll;
};
