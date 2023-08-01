import { FormEvent, FunctionComponent, MouseEvent } from "react";
import { CanvasProps } from "../types/synth.types";
import { AiOutlineLoading } from "react-icons/ai";
import BottomMenu from "./BottomMenu";

const Canvas: FunctionComponent<CanvasProps> = ({
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
  handleBlur,
  action,
  writingRef,
  selectedElement,
  font,
  fontOpen,
  setFont,
  setFontOpen,
  dispatch,
  canvasExpand,
  materialBackground,
  materialOpen,
  setMaterialBackground,
  setMaterialOpen,
  layerToSynth
}): JSX.Element => {
  return (
    <div
      className={`h-full w-full flex items-center justify-center rounded-md border border-ama relative ${
        isDragging
          ? "cursor-grabbing"
          : tool === "text"
          ? "cursor-text"
          : "cursor-default"
      }`}
      id="parent"
    >
      {newLayersLoading ? (
        <div className="relative w-fit h-fit items-center justify-center flex animate-spin">
          <AiOutlineLoading size={30} color="#FBDB86" />
        </div>
      ) : (
        <>
          <div
            className={`w-full h-fit flex z-1 left-px ${
              canvasExpand ? "fixed bottom-4 left-4" : "absolute bottom-px"
            }`}
          >
            <BottomMenu
              materialBackground={materialBackground}
              setMaterialBackground={setMaterialBackground}
              materialOpen={materialOpen}
              setMaterialOpen={setMaterialOpen}
              font={font}
              layerToSynth={layerToSynth}
              setFont={setFont}
              fontOpen={fontOpen}
              setFontOpen={setFontOpen}
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
              dispatch={dispatch}
              handleReset={handleReset}
              canvasExpand={canvasExpand}
            />
          </div>
          {action === "writing" && (
            <textarea
              ref={writingRef}
              autoFocus
              className={`w-40 h-16 p-1.5 bg-black/50 border border-white rounded-md text-white text-sm z-10 caret-white`}
              onKeyDown={(e: FormEvent) => handleBlur(e)}
              style={{
                resize: "none",
                position: "absolute",
                top: selectedElement?.y1,
                left: selectedElement?.x1,
                fontFamily: font,
              }}
            ></textarea>
          )}
          <canvas
            id="canvasId"
            ref={canvasRef}
            className="relative z-0 rounded-lg"
            style={{ width: "100%", height: "100%" }}
            onMouseDown={(e: MouseEvent<HTMLCanvasElement>) =>
              handleMouseDown(e)
            }
            onMouseUp={(e: MouseEvent<HTMLCanvasElement>) => handleMouseUp(e)}
            onMouseMove={(e: MouseEvent<HTMLCanvasElement>) =>
              handleMouseMove(e)
            }
          ></canvas>
        </>
      )}
    </div>
  );
};

export default Canvas;
