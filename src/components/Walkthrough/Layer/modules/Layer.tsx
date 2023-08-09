import { FunctionComponent } from "react";
import { LayerProps } from "../types/layer.types";
import Grid from "./Grid";

const Layer: FunctionComponent<LayerProps> = ({
  layers,
  dispatch,
  synthLayer,
  layersLoading,
  scrollToPreRoll
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid
        dispatch={dispatch}
        layers={layers}
        synthLayer={synthLayer}
        layersLoading={layersLoading}
        scrollToPreRoll={scrollToPreRoll}
      />
    </div>
  );
};

export default Layer;
