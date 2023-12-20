import { FunctionComponent } from "react";
import { ColorChoiceProps } from "../types/common.types";
import { setPreroll } from "../../../../redux/reducers/prerollSlice";
import { setSearchExpand } from "../../../../redux/reducers/searchExpandSlice";

const ColorChoice: FunctionComponent<ColorChoiceProps> = ({
  dispatch,
  prerolls,
  preroll,
  left,
  right,
  search,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex justify-end">
      <div className="relative w-fit h-fit flex flex-row gap-1.5 justify-start">
        {preroll.collectionMetadata?.colors?.map(
          (color: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-5 h-5 border rounded-full cursor-pointer ${
                  preroll.chosenColor?.toLowerCase() === color?.toLowerCase()
                    ? "border-fresa"
                    : "border-white"
                }`}
                onClick={() => {
                  if (search) {
                    dispatch(
                      setSearchExpand({ ...preroll, chosenColor: color })
                    );
                  } else {
                    const updated = {
                      left: left
                        ? prerolls.left.map((obj) =>
                            obj?.collectionMetadata?.images?.[0] ===
                            preroll?.collectionMetadata?.images?.[0]
                              ? { ...obj, chosenColor: color }
                              : obj
                          )
                        : prerolls.left,
                      right: right
                        ? prerolls.right.map((obj) =>
                            obj?.collectionMetadata?.images?.[0] ===
                            preroll?.collectionMetadata?.images?.[0]
                              ? { ...obj, chosenColor: color }
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
                style={{ backgroundColor: color }}
              ></div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ColorChoice;
