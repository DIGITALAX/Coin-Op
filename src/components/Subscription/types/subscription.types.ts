import { AnyAction, Dispatch } from "redux";
import { SubscriptionInfoState } from "../../../../redux/reducers/subscriptionInfoSlice";

export type SubscribeProps = {
  dispatch: Dispatch<AnyAction>;
  connectedPKP: string | undefined;
};

export type ActivateSub = {
  dispatch: Dispatch<AnyAction>;
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
  subscriptionInfo: SubscriptionInfoState;
};
