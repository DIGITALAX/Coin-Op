import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { SynthContext } from "@/app/providers";
import { SetProps } from "../../types/walkthrough.types";

const Set: FunctionComponent<SetProps> = ({ synthLayer }): JSX.Element => {
  const synthContext = useContext(SynthContext);
  return (
    <div
      className={`relative w-48 h-44 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:opacity-70 ${
        synthLayer?.id === synthContext?.current?.synth?.id && "opacity-40"
      }`}
      onClick={() =>
        synthContext?.setCurrent((prev) => ({
          ...prev!,
          synth: synthLayer!,
          layer: synthLayer?.children?.[0],
        }))
      }
    >
      <div className="absolute w-full h-full">
        <Image
          layout="fill"
          objectFit="cover"
          src={`${INFURA_GATEWAY}/ipfs/QmabrLTvs7EW8P9sZ2WGcf1gSrc4n3YmsFyvtcLYN8gtuP`}
          draggable={false}
        />
      </div>
      <div className="relative flex flex-col w-full h-full gap-2 items-center justify-between p-2">
        <div className="relative w-full h-3/4">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              layout="fill"
              objectFit="contain"
              src={`${INFURA_GATEWAY}/ipfs/${
                synthLayer?.uri?.split("ipfs://")[1]
              }`}
              draggable={false}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center h-full w-full">
            <div className="relative items-center justify-center flex w-full h-full">
              <Image
                layout="fill"
                objectFit="contain"
                src={`${INFURA_GATEWAY}/ipfs/${
                  synthLayer?.poster?.split("ipfs://")[1]
                }`}
                draggable={false}
                className="flex items-center"
              />
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-row font-mana text-white text-xxxs px-1.5 gap-1.5 justify-between">
          <div className="relative w-fit h-fit">FGO</div>
          <div className="relative w-fit h-fit">PID-{Number(synthLayer?.id)}</div>
          <div className="relative w-fit h-fit">
            ${Number(synthLayer?.price) / 10 ** 18}
          </div>
          <div className="relative w-fit h-fit">
            CID-{synthLayer?.children?.length}
          </div>
          <div className="relative w-fit h-fit">
            $
            {Number(
              synthLayer?.children?.reduce(
                (accumulator, currentItem) =>
                  accumulator + Number(currentItem.price),
                0
              )
            ) /
              10 ** 18}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Set;
