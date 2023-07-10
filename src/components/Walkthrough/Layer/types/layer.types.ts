import { AnyAction, Dispatch } from "redux";

export interface Layer {
  parentURI: string;
  childTokenURIs: string[];
  childTokenIds: number[];
  parentTokenId: number;
  price: string;
  childPrices: string[];
  printType: string;
}

export type LayerProps = {
  layers: Layer[];
  dispatch: Dispatch<AnyAction>;
  synthLayer: Layer | undefined;
  layersLoading: boolean;
};

export type GridProps = {
  layers: Layer[];
  dispatch: Dispatch<AnyAction>;
  synthLayer: Layer | undefined;
  layersLoading: boolean;
};

export type SetProps = {
  layer: Layer | undefined;
  dispatch: Dispatch<AnyAction>;
  synthLayer: Layer | undefined;
};
