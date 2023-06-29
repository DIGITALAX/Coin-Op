import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps } from "../types/synth.types";

const Grid: FunctionComponent<GridProps> = ({
  dispatch,
  scrollRef,
}): JSX.Element => {
  return (
    <div className="relative w-full h-100 flex flex-col gap-2" ref={scrollRef}>
      <div className="absolute w-full h-full flex">
        <Image
          alt="copy"
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
          draggable={false}
        />
      </div>
      <div className="relative w-full flex flex-col h-full px-7 pt-4">
        <div className="absolute bottom-6 right-12 w-fit h-fit flex flex-row gap-3 text-white items-center justify-center text-center">
          <div className="relative w-full h-full flex"></div>
          <div className="relative flex flex-col w-full h-full">
            <div className="relative w-full h-full flex"></div>
            <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
              <div className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                  layout="fill"
                  draggable={false}
                />
              </div>
              <div className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                  layout="fill"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute text-white flex font-mana text-3xl uppercase bottom-4"
        draggable={false}
      >
        make it yours
      </div>
    </div>
  );
};

export default Grid;
