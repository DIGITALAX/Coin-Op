import { FunctionComponent } from "react";
import { FiTool } from "react-icons/fi";
import Sketch from "@uiw/react-color-sketch";
import CanvasOption from "./CanvasOption";
import { BottomMenuProps } from "../types/synth.types";

const BottomMenu: FunctionComponent<BottomMenuProps> = ({
  setShowBottomOptions,
  showBottomOptions,
  colorPicker,
  setColorPicker,
  hex,
  setHex,
  setThickness,
  thickness,
  setBrushWidth,
  brushWidth,
  setTool,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit inline-flex flex-wrap pb-3 px-3 gap-2">
      <div
        className="relative w-6 h-6 rounded-md bg-white grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-end"
        onClick={() => setShowBottomOptions(!showBottomOptions)}
      >
        <div className="col-start-1 relative w-fit h-fit place-self-center">
          <FiTool color="black" size={15} />
        </div>
      </div>
      {showBottomOptions && (
        <div className="absolute w-full h-fit inline-flex flex-wrap gap-2 left-12">
          <CanvasOption
            bgColor="black"
            image="QmPvfTS6brNvnTN6e6L2Btp8eAMxC8XhErrtQEjYF1nB8o"
            width={12}
            height={12}
            setShowString={setTool}
            string_option={"selection"}
          />
          <CanvasOption
            bgColor="black"
            image="QmPVmyozQu3DwX2f5dQnv6MgRtmDckrnKNje2A4ettN9qS"
            width={15}
            height={15}
            setShowString={setTool}
            string_option={"resize"}
          />
          <CanvasOption
            image="Qmf1L4mzx9yyJtZHYTQqwrdV1UX1BWjFwN6bfrxjMAuuKx"
            bgColor="black"
            width={14}
            height={12}
            setShowString={setTool}
            string_option={"pencil"}
          />
          {thickness && (
            <div className="absolute bottom-10 flex flex-col w-fit h-fit">
              <input
                type="range"
                className="w-full"
                value={brushWidth}
                onChange={(e) => setBrushWidth(Number(e.target.value))}
              />
            </div>
          )}
          <CanvasOption
            image="QmXsWSdgvoieTtWYFskRmZCUnTN7WHvffxd3kSZMTcBjxm"
            bgColor="black"
            width={17}
            height={20}
            setShowBool={setThickness}
            bool_option={thickness}
          />
          <CanvasOption
            image="QmcsGqcvZv4jXFeN9Eg9b1aDMF5asQbLB2bKLB88PzBLna"
            bgColor="black"
            width={15}
            height={15}
            setShowString={setTool}
            string_option={"text"}
          />
          <CanvasOption
            image="QmSfhjtPDNBq4FZZMkFNRna8e9gwL1fEU7oxdyysGGVhnU"
            bgColor="black"
            width={15}
            height={15}
            setShowString={setTool}
            string_option={"erase"}
          />
          {colorPicker && (
            <div className="absolute bottom-8 flex flex-col w-fit h-fit">
              <Sketch
                color={hex}
                onChange={(color) => {
                  setHex(color.hexa);
                }}
              />
            </div>
          )}
          <CanvasOption
            image="Qmd3CpLhtiUhYkWw12DDmWf8M5mRMs3jZdz9JhhX7m1NLW"
            color
            width={15}
            height={15}
            setShowBool={setColorPicker}
            bool_option={colorPicker}
          />
        </div>
      )}
    </div>
  );
};

export default BottomMenu;
