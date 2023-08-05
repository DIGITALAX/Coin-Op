import { FunctionComponent } from "react";
import { SynthProps } from "../types/synth.types";
import Grid from "./Grid";

const Synth: FunctionComponent<SynthProps> = ({
  dispatch,
  synthLayerSelected,
  synthLayer,
  synthConfig,
  handleSynth,
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
  handleReset,
  writingRef,
  handleBlur,
  action,
  font,
  fontOpen,
  setFont,
  setFontOpen,
  canvasExpand,
  materialBackground,
  materialOpen,
  setMaterialBackground,
  setMaterialOpen,
  completedSynths,
  handleDownloadImage,
  synthLoading,
}): JSX.Element => {
  return (
    <div className={`relative w-full h-fit flex flex-col`}>
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
        canvasExpand={canvasExpand}
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
        handleReset={handleReset}
        materialBackground={materialBackground}
        setMaterialBackground={setMaterialBackground}
        materialOpen={materialOpen}
        setMaterialOpen={setMaterialOpen}
        completedSynths={completedSynths}
        handleDownloadImage={handleDownloadImage}
      />
    </div>
  );
};

export default Synth;
