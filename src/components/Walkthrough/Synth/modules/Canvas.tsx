import { FunctionComponent, MouseEvent } from "react";
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
}): JSX.Element => {
  return (
    <div
      className={`relative h-full w-full flex items-center justify-center rounded-md border border-ama ${
        isDragging ? "cursor-grabbing" : "cursor-cell"
      }`}
      id="parent"
    >
      {/* <Image
        src={`${INFURA_GATEWAY}/ipfs/QmPKU1ck9PLyFchFpe2vzJh3eyxSYij28ixTdRzaHi4E1p`}
        layout="fill"
        objectFit="cover"
        className="rounded-md absolute"
        draggable={false}
      /> */}
      {newLayersLoading ? (
        <div className="relative w-fit h-fit items-center justify-center flex animate-spin">
          <AiOutlineLoading size={30} color="#FBDB86" />
        </div>
      ) : (
        <>
          <div className="absolute w-full h-fit flex z-1 bottom-1 left-1">
            <BottomMenu
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
            />
          </div>
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
            // onWheel={(e: WheelEvent<HTMLCanvasElement>) => handleWheel(e)}
          ></canvas>
        </>
      )}
    </div>
  );
};

export default Canvas;
