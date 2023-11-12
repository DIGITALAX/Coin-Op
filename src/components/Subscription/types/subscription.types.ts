import { AnyAction, Dispatch } from "redux";
import { SubscriptionInfoState } from "../../../../redux/reducers/subscriptionInfoSlice";
import { PKPSig } from "../../../../redux/reducers/currentPKPSlice";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { NextRouter } from "next/router";
import { AuthSig, SessionSig } from "@lit-protocol/types";

export type SubscribeProps = {
  dispatch: Dispatch<AnyAction>;
  connectedPKP: PKPSig | undefined;
  client: LitNodeClient;
  router: NextRouter;
  subscriptionInfo: string | undefined;
};

export type ActivateSub = {
  dispatch: Dispatch<AnyAction>;
  client: LitNodeClient;
  router: NextRouter;
  connectedPKP:
    | {
        ethAddress: string;
        publicKey: string;
        tokenId: {
          hex: string;
          type: string;
        };
        sessionSig: SessionSig;
        pkpWallet: any;
        authSig: AuthSig;
        encryptedToken: string;
      }
    | undefined;
  subscriptionInfo: SubscriptionInfoState;
};
