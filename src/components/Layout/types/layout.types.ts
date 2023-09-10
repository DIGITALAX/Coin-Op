import { CartItem, PreRoll } from "@/components/Common/types/common.types";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import { PreRollState } from "../../../../redux/reducers/preRollSlice";

export type StickyProps = {
  router: NextRouter;
  scrollToCheckOut: () => void;
  cartItems: CartItem[];
  cartAnim: boolean;
  dispatch: Dispatch<AnyAction>;
  videoPlayer: boolean;
  connected: boolean;
  chain: number | undefined;
  connectedPKP:
    | {
        ethAddress: string;
        publicKey: string;
        tokenId: {
          hex: string;
          type: string;
        };
        sessionSig: any;
        pkpWallet: any;
        authSig: any;
        encryptedToken: string;
      }
    | undefined;
  openAccountModal: (() => void) | undefined;
  openChainModal: (() => void) | undefined;
};

export type MobileFotosProps = {
  preRolls: PreRollState;
  dispatch: Dispatch<AnyAction>;
  preRollsLoading: boolean;
};
