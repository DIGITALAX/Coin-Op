import { FunctionComponent } from "react";
import { SizingChoiceProps } from "../types/common.types";
import { setPreroll } from "../../../../redux/reducers/prerollSlice";
import { setSearchExpand } from "../../../../redux/reducers/searchExpandSlice";

const SizingChoice: FunctionComponent<SizingChoiceProps> = ({
  dispatch,
  prerolls,
  preroll,
  left,
  right,
  search,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex justify-center">
      <div
        className="relative w-fit h-fit flex flex-row gap-1.5 justify-start overflow-x-scroll"
        id="xScroll"
      >
        {preroll.collectionMetadata?.sizes?.map(
          (size: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative border rounded-full cursor-pointer flex items-center justify-center text-xxs h-6 uppercase font-mana ${
                  preroll.chosenSize === size
                    ? "border-fresa bg-white text-black"
                    : "border-white text-white"
                } ${
                  preroll.printType !== "0" && preroll.printType !== "1"
                    ? "w-6"
                    : "w-fit px-1.5"
                }`}
                onClick={() => {
                  if (search) {
                    dispatch(setSearchExpand({ ...preroll, chosenSize: size }));
                  } else {
                    const updated = {
                      left: left
                        ? prerolls.left.map((obj) =>
                            obj?.collectionMetadata?.images?.[0] ===
                            preroll?.collectionMetadata?.images?.[0]
                              ? { ...obj, chosenSize: size }
                              : obj
                          )
                        : prerolls.left,
                      right: right
                        ? prerolls.right.map((obj) =>
                            obj?.collectionMetadata?.images?.[0] ===
                            preroll?.collectionMetadata?.images?.[0]
                              ? { ...obj, chosenSize: size }
                              : obj
                          )
                        : prerolls.right,
                    };
                    dispatch(
                      setPreroll({
                        actionLeft: updated.left,
                        actionRight: updated.right,
                      })
                    );
                  }
                }}
              >
                {size}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default SizingChoice;
