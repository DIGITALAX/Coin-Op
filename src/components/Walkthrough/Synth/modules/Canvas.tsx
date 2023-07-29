import Image from "next/legacy/image";
import {
  FunctionComponent,
  MouseEvent,
  WheelEvent,
  useEffect,
  useState,
} from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { CanvasProps } from "../types/synth.types";
import { AiOutlineLoading } from "react-icons/ai";

const Canvas: FunctionComponent<CanvasProps> = ({
  synthLayerSelected,
  canvasRef,
  handleMouseDown,
  handleMouseUp,
  handleWheel,
  handleMouseMove,
  newLayersLoading,
}): JSX.Element => {
  const [dimensions, setDimensions] = useState({
    width: "100%",
    height: "100%",
  });

  useEffect(() => {
    const parent = document.getElementById("parent");
    if (parent) {
      setDimensions({
        width: String(parent.offsetWidth),
        height: String(parent.offsetHeight),
      });
    }
  }, []);

  return (
    <div
      className="relative h-full w-full flex items-center justify-center rounded-md border border-ama cursor-cell"
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
        <canvas
          id="canvasId"
          ref={canvasRef}
          className="relative z-0 rounded-lg"
          style={{ width: "100%", height: "100%" }}
          onMouseDown={(e: MouseEvent<HTMLCanvasElement>) => handleMouseDown(e)}
          onMouseUp={(e: MouseEvent<HTMLCanvasElement>) => handleMouseUp(e)}
          onMouseMove={(e: MouseEvent<HTMLCanvasElement>) => handleMouseMove(e)}
          onWheel={(e: WheelEvent<HTMLCanvasElement>) => handleWheel(e)}
        ></canvas>
      )}
    </div>
  );
};

export default Canvas;
