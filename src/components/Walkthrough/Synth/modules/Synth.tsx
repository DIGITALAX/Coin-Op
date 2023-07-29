import { FunctionComponent } from "react";
import { SynthProps } from "../types/synth.types";
import Grid from "./Grid";

const Synth: FunctionComponent<SynthProps> = ({
  dispatch,
  synthLayerSelected,
  synthLayer,
  synthConfig,
  handleSynth,
  synthLoading,
  presets,
  scrollToComposite,
  canvasRef,
  handleMouseDown,
  handleMouseUp,
  handleWheel,
  handleMouseMove,
  newLayersLoading
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col ">
      <Grid
        dispatch={dispatch}
        synthLayerSelected={synthLayerSelected}
        synthLayer={synthLayer}
        synthConfig={synthConfig}
        handleSynth={handleSynth}
        synthLoading={synthLoading}
        presets={presets}
        scrollToComposite={scrollToComposite}
        canvasRef={canvasRef}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseMove={handleMouseMove}
        handleWheel={handleWheel}
        newLayersLoading={newLayersLoading}
      />
    </div>
  );
};

export default Synth;
