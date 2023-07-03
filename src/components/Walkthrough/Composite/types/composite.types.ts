import { Profile } from "@/components/Common/types/lens.types";
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
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  shareSet: boolean;
  setShareSet: (e: boolean) => void;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
  address: `0x${string}` | undefined;
  models: string[];
  signInLoading: boolean;
};

export type ModelProps = {
  model: string;
};

export type ModelsProps = {
  models: string[];
};
