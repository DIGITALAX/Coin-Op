import { AnyAction, Dispatch } from "redux";

export type CompositeProps = {
  dispatch: Dispatch<AnyAction>;
  shareSet: boolean;
  setShareSet: (e: boolean) => void;
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  shareSet: boolean;
  setShareSet: (e: boolean) => void;
};
