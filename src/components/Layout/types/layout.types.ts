import { CartItem } from "@/components/Common/types/common.types";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import { PrerollState } from "../../../../redux/reducers/prerollSlice";
import { Profile } from "@/components/Common/types/generated";
import { FullScreenVideoState } from "../../../../redux/reducers/fullScreenVideoSlice";
import { TFunction, i18n } from "i18next";

export type StickyProps = {
  router: NextRouter;
  i18n: i18n;
  scrollToCheckOut: () => void;
  cartItems: CartItem[];
  t: TFunction<"common", undefined>;
  cartAnim: boolean;
  dispatch: Dispatch<AnyAction>;
  fullScreenVideo: FullScreenVideoState;
  signInLoading: boolean;
  connected: boolean;
  chain: number | undefined;
  handleLogout: () => void;
  openChainModal: (() => void) | undefined;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
};

export type MobileFotosProps = {
  prerolls: PrerollState;
  dispatch: Dispatch<AnyAction>;
  prerollsLoading: boolean;
  t: TFunction<"common", undefined>;
};
