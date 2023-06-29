import { FunctionComponent } from "react";
import { LayerProps } from "../types/layer.types";
import Grid from "./Grid";

const Layer: FunctionComponent<LayerProps> = ({
  layers,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-5">
      <Grid dispatch={dispatch} layers={layers}/>
    </div>
  );
};

export default Layer;
