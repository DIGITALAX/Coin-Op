import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps, Layer } from "../types/layer.types";
import Set from "./Set";

const Grid: FunctionComponent<GridProps> = ({
  layers,
  dispatch,
  synthLayer,
}): JSX.Element => {
  return (
    <div className="relative w-full h-100 flex flex-col gap-2">
      <div className="absolute w-full h-full flex">
        <Image
          alt="copy"
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
          draggable={false}
        />
      </div>
      <div className="relative w-full flex h-3/4 px-7 pt-4">
        <div className="relative w-fit flex flex-row flex-wrap h-full overflow-y-scroll gap-8 items-center justify-center">
          {layers?.map((value: Layer, index: number) => {
            return (
              <Set
                key={index}
                dispatch={dispatch}
                layer={value}
                synthLayer={synthLayer}
              />
            );
          })}
        </div>
      </div>
      <div className="absolute bottom-6 right-12 w-fit h-fit flex flex-row gap-3 text-white items-center justify-center text-center">
        <div
          className="relative w-fit h-fit items-center justify-center flex font-herm text-lg"
          id="arrowsLeft"
        >{`<<<`}</div>
        <div className="relative w-fit h-fit items-center justify-center text-center flex font-mega text-3xl uppercase pr-1">
          or buy preroll
        </div>
        <div
          className="relative w-fit h-fit items-center justify-center flex font-herm text-lg"
          id="arrowsRight"
        >{`>>>`}</div>
      </div>
      <div
        className="absolute text-white font-mana text-3xl uppercase bottom-4"
        draggable={false}
      >
        choose layer set
      </div>
    </div>
  );
};

export default Grid;
