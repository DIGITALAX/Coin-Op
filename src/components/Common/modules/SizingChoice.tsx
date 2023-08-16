import { FunctionComponent } from "react";
import { SizingChoiceProps } from "../types/common.types";
import { setPreRoll } from "../../../../redux/reducers/preRollSlice";

const SizingChoice: FunctionComponent<SizingChoiceProps> = ({
  dispatch,
  preRolls,
  preRoll,
  left,
  right,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex justify-center">
      <div
        className="relative w-fit h-fit flex flex-row gap-1.5 justify-start overflow-x-scroll"
        id="xScroll"
      >
        {preRoll.sizes?.map((size: string, index: number) => {
          return (
            <div
              key={index}
              className={`relative border rounded-full cursor-pointer flex items-center justify-center text-xs h-6 uppercase font-mana ${
                preRoll.chosenSize === size
                  ? "border-fresa bg-white text-black"
                  : "border-white text-white"
              } ${
                preRoll.printType === "shirt" || preRoll.printType === "hoodie"
                  ? "w-6"
                  : "w-fit px-1.5"
              }`}
              onClick={() => {
                const updated = {
                  left: left
                    ? preRolls.left.map((obj) =>
                        obj.uri.images?.[0] === preRoll?.uri?.images?.[0]
                          ? { ...obj, chosenSize: size }
                          : obj
                      )
                    : preRolls.left,
                  right: right
                    ? preRolls.right.map((obj) =>
                        obj.uri.images?.[0] === preRoll?.uri?.images?.[0]
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
