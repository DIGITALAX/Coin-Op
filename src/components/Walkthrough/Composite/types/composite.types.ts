import { Profile } from "@/components/Common/types/generated";
import { LegacyRef, RefObject } from "react";
import { AnyAction, Dispatch } from "redux";

export type CompositeProps = {
  dispatch: Dispatch<AnyAction>;
  shareSet: boolean;
  setShareSet: (e: boolean) => void;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
  address: `0x${string}` | undefined;
  models: string[];
  signInLoading: boolean;
  compositeRef: LegacyRef<HTMLDivElement> | undefined;
  openChainModal: (() => void) | undefined;
  chain: number | undefined;
  apiKey: string | undefined;
};

export type GridProps = {
  apiKey: string | undefined;
  dispatch: Dispatch<AnyAction>;
  shareSet: boolean;
  setShareSet: (e: boolean) => void;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
  address: `0x${string}` | undefined;
  models: string[];
  signInLoading: boolean;
  compositeRef: LegacyRef<HTMLDivElement> | undefined;
  openChainModal: (() => void) | undefined;
  chain: number | undefined;
};

export type ModelProps = {
  model: string;
};

export type ModelsProps = {
  models: string[];
};
