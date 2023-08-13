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
    <div className="relative w-full h-fit flex justify-end">
      <div className="relative w-fit h-fit flex flex-row gap-1.5 justify-start">
        {preRoll.colors?.map((color: string, index: number) => {
          return (
            <div
              key={index}
              className={`relative w-5 h-5 border rounded-full cursor-pointer ${
                preRoll.chosenColor === color ? "border-fresa" : "border-white"
              }`}
              onClick={() => {
                const updated = {
                  left: left
                    ? preRolls.left.map((obj) =>
                        obj.uri.images?.[0] === preRoll.uri.images?.[0]
                          ? { ...obj, chosenColor: color }
                          : obj
                      )
                    : preRolls.left,
                  right: right
                    ? preRolls.right.map((obj) =>
                        obj.uri.images?.[0] === preRoll.uri.images?.[0]
                          ? { ...obj, chosenColor: color }
                          : obj
                      )
                    : preRolls.right,
                };

                dispatch(
                  setPreRoll({
                    actionLeft: updated.left,
                    actionRight: updated.right,
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
