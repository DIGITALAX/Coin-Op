import {
  FormEvent,
  FunctionComponent,
  JSX,
  MouseEvent,
  useContext,
} from "react";
import { AiOutlineLoading } from "react-icons/ai";
import BottomMenu from "./BottomMenu";
import { SynthContext } from "@/app/providers";
import { CanvasProps } from "../../types/walkthrough.types";

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
  materialBackground,
  materialOpen,
  setMaterialBackground,
  setMaterialOpen,
  synthLoading,
}): JSX.Element => {
  const synthContext = useContext(SynthContext);
  return (
    <div
      className={`h-full w-full flex items-center justify-center rounded-md border border-ama relative ${
        synthLoading
          ? "cursor-wait"
          : isDragging
          ? "cursor-grabbing"
          : tool === "text"
          ? "cursor-text"
          : tool === "move"
          ? "cursor-move"
          : "cursor-default"
      }`}
      id="parent"
    >
      {newLayersLoading ? (
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "100%",
            height: synthContext?.canvasExpand ? "100%" : "373px",
            maxHeight: synthContext?.canvasExpand ? "100%" : "373px",
          }}
        >
          <div className="relative w-fit h-fit items-center justify-center flex animate-spin">
            <AiOutlineLoading size={30} color="#FBDB86" />
          </div>
        </div>
      ) : (
        <>
          <div
            className={`w-full h-fit flex z-1 left-px ${
              synthContext?.canvasExpand
                ? "fixed bottom-4 left-4"
                : "absolute bottom-px"
            }`}
          >
            <BottomMenu
              materialBackground={materialBackground}
              setMaterialBackground={setMaterialBackground}
              materialOpen={materialOpen}
              setMaterialOpen={setMaterialOpen}
              font={font}
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
              handleReset={handleReset}
              synthLoading={synthLoading}
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
            style={{
              width: "100%",
              height: synthContext?.canvasExpand ? "100%" : "373px",
              maxHeight: synthContext?.canvasExpand ? "100%" : "373px",
            }}
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
