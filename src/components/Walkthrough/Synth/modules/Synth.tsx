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
  selectedElement,
  scrollToComposite,
  canvasRef,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
  newLayersLoading,
  isDragging,
  hex,
  setHex,
  setColorPicker,
  showBottomOptions,
  setShowBottomOptions,
  thickness,
  setThickness,
  brushWidth,
  setBrushWidth,
  setTool,
  colorPicker,
  tool,
  undo,
  redo,
  handleImageAdd,
  handleReset,
  writingRef,
  handleBlur,
  action,
  font,
  fontOpen,
  setFont,
  setFontOpen,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col ">
      <Grid
        font={font}
        setFont={setFont}
        fontOpen={fontOpen}
        setFontOpen={setFontOpen}
        action={action}
        handleBlur={handleBlur}
        writingRef={writingRef}
        dispatch={dispatch}
        synthLayerSelected={synthLayerSelected}
        synthLayer={synthLayer}
        synthConfig={synthConfig}
        handleSynth={handleSynth}
        synthLoading={synthLoading}
        presets={presets}
        tool={tool}
        selectedElement={selectedElement}
        scrollToComposite={scrollToComposite}
        canvasRef={canvasRef}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseMove={handleMouseMove}
        newLayersLoading={newLayersLoading}
        isDragging={isDragging}
        showBottomOptions={showBottomOptions}
        setShowBottomOptions={setShowBottomOptions}
        colorPicker={colorPicker}
        setColorPicker={setColorPicker}
        hex={hex}
        setHex={setHex}
        setThickness={setThickness}
        thickness={thickness}
        setBrushWidth={setBrushWidth}
        brushWidth={brushWidth}
        setTool={setTool}
        undo={undo}
        redo={redo}
        handleImageAdd={handleImageAdd}
        handleReset={handleReset}
      />
    </div>
  );
};

export default Synth;
