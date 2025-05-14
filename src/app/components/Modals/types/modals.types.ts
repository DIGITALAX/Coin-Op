import {
  ArticleMetadata,
  AudioMetadata,
  ImageMetadata,
  Post,
  Repost,
  StoryMetadata,
  TextOnlyMetadata,
  VideoMetadata,
} from "@lens-protocol/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ChangeEvent, SetStateAction } from "react";

export type WhoSwitchProps = {
  reactors: any[];
  quoters: Post[];
  hasMore: boolean;
  dict: any;
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

export type PublicationProps = {
  item: Post | Repost;
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
  dict: any;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  router: AppRouterInstance;
};

export type TextProps = {
  metadata: ArticleMetadata | StoryMetadata | TextOnlyMetadata;
};

export type MediaProps = {
  disabled: boolean | undefined;
  metadata: ImageMetadata | VideoMetadata | AudioMetadata;
};

export type PostQuoteProps = {
  quote: Post;
  router: AppRouterInstance;
  pink?: boolean;
  disabled: boolean | undefined;
};

export type PostBarProps = {
  index: number;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  mirror: (id: string) => Promise<void>;
  simpleCollect: (id: string, type: string) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    collect: boolean;
  }[];
  item: Post;
  dict: any;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  openMirrorChoice: boolean[];
  router: AppRouterInstance;
  disabled: boolean;
};

export type PostSwitchProps = {
  item: Post | Repost;
  disabled: boolean | undefined;
};

export type WaveFormProps = {
  keyValue: string;
  audio: string;
  video: string;
  type: string;
  upload?: boolean;
  handleMedia?: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

export type MediaSwitchProps = {
  type: string;
  srcUrl: string;
  srcCover?: string;
  classNameVideo?: string;
  classNameImage?: string;
  classNameAudio?: string;
  objectFit?: string;
  hidden?: boolean;
};
