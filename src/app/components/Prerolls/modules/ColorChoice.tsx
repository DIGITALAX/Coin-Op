import { FunctionComponent, JSX, useContext } from "react";
import { ColorChoiceProps } from "../types/prerolls.types";
import { ModalContext } from "@/app/providers";

const ColorChoice: FunctionComponent<ColorChoiceProps> = ({
  preroll,
  left,
  right,
  search,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex justify-end">
      <div className="relative w-fit h-fit flex flex-row gap-1.5 justify-start">
        {preroll.metadata?.colors?.map(
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
                    context?.setSearchExpand({
                      ...preroll,
                      chosenColor: color,
                    });
                  } else {
                    const updated = {
                      left: left
                        ? context?.prerolls.left.map((obj) =>
                            obj?.metadata?.images?.[0] ===
                            preroll?.metadata?.images?.[0]
                              ? { ...obj, chosenColor: color }
                              : obj
                          )
                        : context?.prerolls.left,
                      right: right
                        ? context?.prerolls.right.map((obj) =>
                            obj?.metadata?.images?.[0] ===
                            preroll?.metadata?.images?.[0]
                              ? { ...obj, chosenColor: color }
                              : obj
                          )
                        : context?.prerolls.right,
                    };

                    context?.setPrerolls({
                      left: updated.left || [],
                      right: updated.right || [],
                    });
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
