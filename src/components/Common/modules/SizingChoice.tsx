import { FunctionComponent } from "react";
import { ColorChoiceProps } from "../types/common.types";
import { setPreRoll } from "../../../../redux/reducers/preRollSlice";

const SizingChoice: FunctionComponent<ColorChoiceProps> = ({
  dispatch,
  preRolls,
  preRoll,
  left,
  right,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex justify-center">
      <div className="relative w-fit h-fit flex flex-row gap-1.5 justify-start">
        {preRoll.sizes?.map((size: string, index: number) => {
          return (
            <div
              key={index}
              className={`relative w-6 h-6 border rounded-full cursor-pointer flex items-center justify-center  uppercase font-mana text-xs ${
                preRoll.chosenSize === size
                  ? "border-fresa bg-white text-black"
                  : "border-white text-white"
              }`}
              onClick={() => {
                const updated = {
                  left: left
                    ? preRolls.left.map((obj) =>
                        obj.image === preRoll.image
                          ? { ...obj, chosenSize: size }
                          : obj
                      )
                    : preRolls.left,
                  right: right
                    ? preRolls.right.map((obj) =>
                        obj.image === preRoll.image
                          ? { ...obj, chosenSize: size }
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
            >
              {size}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SizingChoice;
