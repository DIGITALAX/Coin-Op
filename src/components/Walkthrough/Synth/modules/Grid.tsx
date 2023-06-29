import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps } from "../types/synth.types";
import { setLayerToSynth } from "../../../../../redux/reducers/layerToSynthSlice";

const Grid: FunctionComponent<GridProps> = ({
  dispatch,
  synthLayerSelected,
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
      <div className="relative w-full flex h-5/6  px-7 pt-4">
        <div className="relative w-full flex flex-row h-full gap-8 items-center justify-center">
          <div className="relative flex flex-col gap-3 w-full h-full">
            <div className="relative w-full h-full flex items-center justify-center rounded-md border border-ama">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmPKU1ck9PLyFchFpe2vzJh3eyxSYij28ixTdRzaHi4E1p`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                draggable={false}
              />
            </div>
            <div className="relative w-full h-40 flex items-center justify-center rounded-md border border-ama">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmPKU1ck9PLyFchFpe2vzJh3eyxSYij28ixTdRzaHi4E1p`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                draggable={false}
              />
            </div>
          </div>
          <div className="relative w-full h-full flex flex-col gap-3">
            <div className="relative h-full w-full h-full flex items-center justify-center rounded-md border border-ama">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmPKU1ck9PLyFchFpe2vzJh3eyxSYij28ixTdRzaHi4E1p`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                draggable={false}
              />
            </div>
            <div className="relative h-10 w-full flex justify-start items-center">
              <div className="relative w-fit h-full items-center justify-start flex flex-row overflow-x-scroll gap-3">
                {synthLayer?.map((value: string, index: number) => {
                  return (
                    <div
                      className={`relative w-full h-full flex flex-row gap-2 border cursor-pointer hover:opacity-70 rounded-lg ${
                        synthLayerSelected === value
                          ? "border-white"
                          : "border-ama"
                      }`}
                      key={index}
                      onClick={() => dispatch(setLayerToSynth(value))}
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/QmPKU1ck9PLyFchFpe2vzJh3eyxSYij28ixTdRzaHi4E1p`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        draggable={false}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                <div className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                    layout="fill"
                    draggable={false}
                    onClick={() =>
                      dispatch(
                        setLayerToSynth(
                          synthLayer[
                            (synthLayer.indexOf(synthLayerSelected) -
                              1 +
                              synthLayer?.length) %
                              synthLayer?.length
                          ]
                        )
                      )
                    }
                  />
                </div>
                <div className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                    layout="fill"
                    draggable={false}
                    onClick={() =>
                      dispatch(
                        setLayerToSynth(
                          synthLayer[
                            (synthLayer.indexOf(synthLayerSelected) + 1) %
                              synthLayer?.length
                          ]
                        )
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-9 w-fit h-fit flex flex-row gap-3 text-white items-center justify-center text-center">
        <div className="relative  w-9 h-3 items-center justify-center flex flex-row">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmZ4XuwsWcHpCXq56LNmAuvVck7D7WLmXWLcLJmGm1rjC4`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div className="relative w-fit h-fit items-center justify-center text-center flex font-mega text-xl uppercase">
          continue or start again?
        </div>
      </div>
      <div
        className="absolute text-white font-mana text-3xl uppercase bottom-4"
        draggable={false}
      >
        presets & synth
      </div>
    </div>
  );
};

export default Grid;
