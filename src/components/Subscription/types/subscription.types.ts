import { AnyAction, Dispatch } from "redux";

export type SubscribeProps = {
  dispatch: Dispatch<AnyAction>;
  connectedPKP: string | undefined;
};

export type ActivateSub = {
  dispatch: Dispatch<AnyAction>;
};
