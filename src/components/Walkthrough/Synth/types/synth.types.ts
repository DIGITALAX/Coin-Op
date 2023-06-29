import { AnyAction, Dispatch } from "redux";

export type SynthProps = {
  dispatch: Dispatch<AnyAction>;
  synthLayerSelected: string;
  synthLayer: string[];
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  synthLayerSelected: string;
  synthLayer: string[];
};
