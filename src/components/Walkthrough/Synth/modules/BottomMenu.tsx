import { FunctionComponent } from "react";
import { FiTool } from "react-icons/fi";
import Sketch from "@uiw/react-color-sketch";
import CanvasOption from "./CanvasOption";
import { BottomMenuProps } from "../types/synth.types";
import { INFURA_GATEWAY, allFonts } from "../../../../../lib/constants";
import Image from "next/legacy/image";
import { setExpandCanvas } from "../../../../../redux/reducers/expandCanvasSlice";

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
  undo,
  redo,
  handleReset,
  font,
  setFont,
  setFontOpen,
  fontOpen,
  dispatch,
  canvasExpand,
}): JSX.Element => {
  return (
    <div
      className={`relative h-fit inline-flex flex-wrap pb-1 px-1 gap-2 ${
        canvasExpand ? "w-full" : "w-1/2"
      }`}
    >
      <div
        className={`relative rounded-md bg-white grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-end ${
          canvasExpand ? "w-10 h-10" : "w-6 h-6"
        }`}
        onClick={() => {
          if (showBottomOptions) {
            setColorPicker(false);
            setThickness(false);
            setFontOpen(false);
          }
          setShowBottomOptions(!showBottomOptions);
        }}
      >
        <div className="col-start-1 relative w-fit h-fit place-self-center">
          <FiTool color="black" size={15} />
        </div>
      </div>
      <div
        className={`relative ${
          canvasExpand ? "w-10 h-10" : "w-6 h-6"
        } rounded-md bg-black grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-end border border-white`}
        onClick={() => dispatch(setExpandCanvas(!canvasExpand))}
      >
        <div className="relative w-4 h-4 place-self-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
            layout="fill"
          />
        </div>
      </div>
      {showBottomOptions && (
        <div
          className={`absolute w-full h-fit inline-flex flex-wrap gap-2 ${
            canvasExpand ? "bottom-16 left-14" : "bottom-8 left-9"
          }`}
        >
          <CanvasOption
            image="QmbXieYCZWQYBzhZVt2AYB6GviyTPCP87KFUZVFKZFL4gb"
            bgColor="black"
            width={12}
            height={12}
            setShowString={setTool}
            string_option={"default"}
            toolTip={"pan"}
            canvasExpand={canvasExpand}
          />
          <div className="relative w-fit h-fit" onClick={() => handleReset()}>
            <CanvasOption
              image="QmRKP7reAbEFgGrv2KmPdUe1eZgAwVmTzZoWfSLAH4gMEc"
              bgColor="black"
              width={13}
              height={15}
              toolTip={"reset canvas"}
              canvasExpand={canvasExpand}
            />
          </div>
          <CanvasOption
            image="Qmf1L4mzx9yyJtZHYTQqwrdV1UX1BWjFwN6bfrxjMAuuKx"
            bgColor="black"
            width={14}
            height={12}
            setShowString={setTool}
            string_option={"pencil"}
            toolTip={"draw"}
            canvasExpand={canvasExpand}
          />
          {thickness && (
            <div className="absolute bottom-16 flex flex-col w-fit h-fit">
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
            width={13}
            height={15}
            setShowBool={setThickness}
            bool_option={thickness}
            toolTip={"brush width"}
            canvasExpand={canvasExpand}
          />
          <CanvasOption
            image="QmcsGqcvZv4jXFeN9Eg9b1aDMF5asQbLB2bKLB88PzBLna"
            bgColor="black"
            width={15}
            height={15}
            setShowString={setTool}
            string_option={"text"}
            toolTip={"text"}
            canvasExpand={canvasExpand}
          />
          {fontOpen && (
            <div
              className={`absolute w-fit  overflow-y-scroll ${
                canvasExpand ? "bottom-20 h-32" : "bottom-16 h-20"
              }`}
            >
              <div className="relative w-fit h-fit flex flex-col justify-start items-center font-mana text-xxs border border-sol rounded-sm bg-black">
                {allFonts?.map((value: string, index: number) => {
                  return (
                    <div
                      className={`relative w-full h-6 border-t border-sol cursor-pointer flex items-center justify-center text-center hover:opacity-60 ${
                        font === value
                          ? "bg-sol text-black"
                          : "text-white bg-black"
                      }`}
                      key={index}
                      onClick={() => setFont(value)}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <CanvasOption
            image="QmfVbx4WbENwe5zMBNMddAUAGzAorYya57Efd6mCH1D2dX"
            bgColor="black"
            width={13}
            height={13}
            setShowBool={setFontOpen}
            bool_option={fontOpen}
            toolTip={"font"}
            canvasExpand={canvasExpand}
          />
          <div
            className="relative row-start-2 w-fit h-fit"
            onClick={() => undo()}
          >
            <CanvasOption
              image="QmZJQePuwQBP8vsa86vrPSVwsqwzam3PRbEbNxdgH7bBe9"
              bgColor="black"
              width={15}
              height={13}
              toolTip={"undo"}
              canvasExpand={canvasExpand}
            />
          </div>
          <div
            className="relative row-start-1 w-fit h-fit"
            onClick={() => redo()}
          >
            <CanvasOption
              image="QmeNcEGW5pAFjPsgLsTDPgUsEm9sy2b1F1WteotshzcKvW"
              bgColor="black"
              width={15}
              height={13}
              toolTip={"redo"}
              canvasExpand={canvasExpand}
            />
          </div>
          <CanvasOption
            canvasExpand={canvasExpand}
            image="QmNQ36ibTtP1PRmwUwVr857q7CcosmQrQWmfXJ5sQeVp7Y"
            bgColor="black"
            width={15}
            height={12}
            setShowString={setTool}
            string_option={"erase"}
            toolTip={"eraser"}
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
            canvasExpand={canvasExpand}
            image="Qmd3CpLhtiUhYkWw12DDmWf8M5mRMs3jZdz9JhhX7m1NLW"
            color
            width={15}
            height={15}
            setShowBool={setColorPicker}
            bool_option={colorPicker}
            toolTip={"color picker"}
          />
        </div>
      )}
    </div>
  );
};

export default BottomMenu;