import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { CanvasOptionProps } from "../types/synth.types";

const CanvasOption: FunctionComponent<CanvasOptionProps> = ({
  setShowBool,
  setShowString,
  bool_option,
  string_option,
  image,
  bgColor,
  width,
  height,
  color,
  text,
  toolTip,
  canvasExpand,
}): JSX.Element => {
  return (
    <div
      className={`relative ${
        canvasExpand ? "w-10 h-10" : "w-6 h-6"
      } rounded-md ${bgColor ? `bg-${bgColor}` : !color && "bg-ocean"} ${
        !color && "border border-white"
      } grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-start`}
      onClick={
        setShowBool
          ? () => setShowBool(!bool_option)
          : setShowString
          ? () => setShowString(string_option as string)
          : () => {}
      }
      title={toolTip}
    >
      <div className="col-start-1 relative w-fit h-fit place-self-center flex">
        {text ? (
          <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1">
            <div className="relative w-fit h-fit text-white font-sats text-[0.5vw] place-self-center">
              {text}
            </div>
            <div className="relative w-fit h-fit text-white font-sats text-sm place-self-center">
              {image}
            </div>
          </div>
        ) : (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${image}`}
            width={canvasExpand ? width * 1.4 : width}
            height={canvasExpand ? height * 1.4 : height}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
};

export default CanvasOption;
