import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps, Layer } from "../types/layer.types";
import Set from "./Set";
import { setPreRollAnim } from "../../../../../redux/reducers/preRollAnimSlice";

const Grid: FunctionComponent<GridProps> = ({
  layers,
  dispatch,
  synthLayer,
  layersLoading,
  scrollToPreRoll,
}): JSX.Element => {
  return (
    <div className="relative w-full h-110 preG:h-100 flex flex-col gap-2">
      <div className="absolute w-full h-full hidden preG:flex">
        <Image
          alt="copy"
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
          draggable={false}
        />
      </div>
      <div className="relative w-full flex h-3/4 sm:px-7 pt-4 order-1">
        <div className="relative w-fit flex flex-row flex-wrap h-full overflow-y-scroll gap-8 items-center justify-center">
          {layersLoading || layers?.length < 1
            ? Array.from({ length: 6 }).map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-48 h-44 flex flex-col items-center justify-center cursor-pointer opacity-50"
                    id="staticLoad"
                  >
                    <div className="absolute w-full h-full">
                      <Image
                        layout="fill"
                        objectFit="cover"
                        src={`${INFURA_GATEWAY}/ipfs/QmabrLTvs7EW8P9sZ2WGcf1gSrc4n3YmsFyvtcLYN8gtuP`}
                        draggable={false}
                      />
                    </div>
                  </div>
                );
              })
            : layers?.map((layer: Layer) => {
                return layer.childTokenURIs?.map(
                  (childTokenURI: string[], indexTwo: number) => {
                    return (
                      <Set
                        key={indexTwo}
                        dispatch={dispatch}
                        parentId={layer.parentTokenId}
                        parentURI={layer?.parentURI}
                        childTokenURIs={childTokenURI}
                        childId={layer.childTokenIds[indexTwo]}
                        childPrice={layer.childPrices[indexTwo]}
                        parentPrice={layer.prices?.[0]}
                        synthLayer={synthLayer}
                        childPosterURI={layer.childPosterURIs[indexTwo]}
                      />
                    );
                  }
                );
              })}
        </div>
      </div>
      <div
        className="relative preG:absolute preG:bottom-6 preG:right-3 sm:right-12 w-full preG:w-fit h-fit flex flex-row gap-1.5 sm:gap-3 text-white items-center justify-center text-center cursor-pointer md:pt-0 pt-4 order-3 preG:order-2"
        onClick={() => {
          dispatch(setPreRollAnim(true));
          window.innerWidth < 1280 && scrollToPreRoll();
        }}
      >
        <div
          className="relative w-fit h-fit items-center justify-center flex font-herm text-sm sm:text-lg"
          id="arrowsLeft"
        >{`<<<`}</div>
        <div className="relative w-fit h-fit items-center justify-center text-center flex font-mega text-sm sm:text-base lg:text-2xl synth:text-3xl uppercase pr-1">
          or buy preroll
        </div>
        <div
          className="relative w-fit h-fit items-center justify-center flex font-herm text-sm  sm:text-lg"
          id="arrowsRight"
        >{`>>>`}</div>
      </div>
      <div
        className="relative w-full flex justify-center preG:w-auto preG:absolute text-white font-mana text-sm sm:text-xl 900:text-3xl uppercase pt-2 preG:pt-0 preG:bottom-4 order-2 preG:order-3"
        draggable={false}
      >
        choose layer set
      </div>
    </div>
  );
};

export default Grid;
