import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import { SizingChoiceProps } from "../types/prerolls.types";

const SizingChoice: FunctionComponent<SizingChoiceProps> = ({
  preroll,
  left,
  right,
  search,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex justify-center">
      <div
        className="relative w-fit h-fit flex flex-row gap-1.5 justify-start overflow-x-scroll"
        id="xScroll"
      >
        {preroll.metadata?.sizes?.map((size: string, index: number) => {
          return (
            <div
              key={index}
              className={`relative border rounded-full cursor-pointer flex items-center justify-center text-xxs h-6 uppercase font-mana whitespace-nowrap ${
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
                  context?.setSearchExpand({ ...preroll, chosenSize: size });
                } else {
                  const updated = context?.prerolls.map((obj) =>
                    obj?.metadata?.images?.[0] ===
                    preroll?.metadata?.images?.[0]
                      ? { ...obj, chosenSize: size }
                      : obj
                  );
                  context?.setPrerolls(updated || []);
                }
              }}
            >
              {size
                ?.replaceAll("Small", "")
                ?.replaceAll("Standard", "")
                ?.replaceAll("Medium", "")
                ?.replaceAll("Large", "")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SizingChoice;
