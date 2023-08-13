import { AnyAction, Dispatch } from "redux";

export interface Layer {
  parentURI: string;
  childTokenURIs: string[][];
  childPosterURIs: string[];
  childTokenIds: number[];
  parentTokenId: number;
  prices: string[];
  childPrices: string[];
  printType: string;
}

export type LayerProps = {
  layers: Layer[];
  scrollToPreRoll: () => void;
  dispatch: Dispatch<AnyAction>;
  synthLayer:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPosterURI: string;
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
        childPosterURI: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  layersLoading: boolean;
  scrollToPreRoll: () => void;
};

export type SetProps = {
  dispatch: Dispatch<AnyAction>;
  synthLayer:
    | {
        parentURI: string;
        childTokenURIs: string[];
        parentPrice: string;
        childPrice: string;
        childPosterURI: string;
        parentId: number;
        childId: number;
      }
    | undefined;
  parentId: number;
  parentURI: string;
  childTokenURIs: string[];
  childPosterURI: string;
  childId: number;
  childPrice: string;
  parentPrice: string;
};
