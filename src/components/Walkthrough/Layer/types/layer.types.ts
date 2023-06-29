import { AnyAction, Dispatch } from "redux";
import { Template } from "../../Format/types/format.types";

export interface Layer {
  name: string;
  templateName: string;
  type: string;
  components: string[];
  image: string[];
}

export type LayerProps = {
  layers: Layer[];
  dispatch: Dispatch<AnyAction>;
  synthLayer: string[]
};

export type GridProps = {
  layers: Layer[];
  dispatch: Dispatch<AnyAction>;
  synthLayer: string[]
};

export type SetProps = {
  layer: Layer;
  dispatch: Dispatch<AnyAction>;
  synthLayer: string[]
};
