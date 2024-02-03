import { CartItem } from "@/components/Common/types/common.types";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import { PrerollState } from "../../../../redux/reducers/prerollSlice";
import { Profile } from "@/components/Common/types/generated";
import { FullScreenVideoState } from "../../../../redux/reducers/fullScreenVideoSlice";

export type StickyProps = {
  router: NextRouter;
  scrollToCheckOut: () => void;
  cartItems: CartItem[];
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
};
