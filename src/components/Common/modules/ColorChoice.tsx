import { FunctionComponent } from "react";
import { ColorChoiceProps } from "../types/common.types";
import { setPreRoll } from "../../../../redux/reducers/preRollSlice";

const ColorChoice: FunctionComponent<ColorChoiceProps> = ({
  dispatch,
  preRolls,
  preRoll,
  left,
  right,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex">
      <div className="relative w-fit h-fit flex flex-row gap-1.5 items-center justify-start overflow-x-scroll">
        {preRoll.colors?.map((color: string, index: number) => {
          console.log({
            color,
            c: preRoll.chosenColor,
          });
          return (
            <div
              key={index}
              className={`relative w-5 h-5 border rounded-full cursor-pointer ${
                preRoll.chosenColor === color ? "border-blue" : "border-white"
              }`}
              onClick={() => {
                const updated = (
                  left ? [...preRolls.left] : [...preRolls.right]
                ).map((obj) => {
                  if (obj.image === preRoll.image) {
                    console.log("here", obj)
                    return { ...obj, chosenColor: color };
                  } else {
                    return obj;
                  }
                });

                dispatch(
                  setPreRoll({
                    actionLeft: left ? updated : [...preRolls.left],
                    actionRight: right ? updated : [...preRolls.right],
                  })
                );
              }}
              style={{ backgroundColor: color }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorChoice;
