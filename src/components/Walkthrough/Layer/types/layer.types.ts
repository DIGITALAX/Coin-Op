import { AnyAction, Dispatch } from "redux";

export interface Layer {
  parentURI: string;
  childTokenURIs: string[][];
  childPosterURIs: string[];
  childTokenIds: number[];
  parentTokenId: number;
  price: string;
  childPrices: string[];
  printType: string;
}

export type LayerProps = {
  layers: Layer[];
  dispatch: Dispatch<AnyAction>;
  synthLayer:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPoster: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  layersLoading: boolean;
};

export type GridProps = {
  layers: Layer[];
  dispatch: Dispatch<AnyAction>;
  synthLayer:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPoster: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  layersLoading: boolean;
};

export type SetProps = {
  dispatch: Dispatch<AnyAction>;
  synthLayer:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPoster: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  parentId: number;
  parentURI: string;
  childTokenURIs: string[];
  childPoster: string;
  childId: number;
  childPrice: string;
  parentPrice: string;
};
