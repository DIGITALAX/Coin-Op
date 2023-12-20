import { FunctionComponent } from "react";
import { LayerProps } from "../types/layer.types";
import Grid from "./Grid";

const Layer: FunctionComponent<LayerProps> = ({
  layers,
  dispatch,
  synthLayer,
  layersLoading,
  scrollToPreroll
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      <Grid
        dispatch={dispatch}
        layers={layers}
        synthLayer={synthLayer}
        layersLoading={layersLoading}
        scrollToPreroll={scrollToPreroll}
      />
    </div>
  );
};

export default Layer;
