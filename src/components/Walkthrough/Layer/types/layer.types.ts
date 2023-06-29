import { AnyAction, Dispatch } from "redux";
import { Template } from "../../Format/types/format.types";

export interface Layer {
  name: string;
  templateName: string;
  type: string;
  components: number;
  image: string[];
}

export type LayerProps = {
  layers: Layer[];
  dispatch: Dispatch<AnyAction>;
};

export type GridProps = {
  layers: Layer[];
  dispatch: Dispatch<AnyAction>;
};

export type SetProps = {
  layer: Layer;
  dispatch: Dispatch<AnyAction>;
};
