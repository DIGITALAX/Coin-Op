import { FunctionComponent } from "react";
import { ColorChoiceProps } from "../types/common.types";

const ColorChoice: FunctionComponent<ColorChoiceProps> = ({
  colors,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex">
      <div className="relative w-fit h-fit flex flex-row gap-1.5 items-center justify-center overflow-x-scroll">
        {colors?.map((color: string, index: number) => {
          return (
            <div
              key={index}
              className="relative w-5 h-5 border border-white rounded-full cursor-pointer"
              style={{ backgroundColor: color }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorChoice;
