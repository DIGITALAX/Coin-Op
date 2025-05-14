import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { usePathname } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import Set from "./Set";
import useLayer from "../../hooks/useLayer";
import { ModalContext, SynthContext } from "@/app/providers";

const Layer: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const path = usePathname();
  const synthContext = useContext(SynthContext);
  const context = useContext(ModalContext);
  const { layersLoading, scrollToPreroll } = useLayer();

  return (
    <div className="relative w-full h-fit flex flex-col">
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
            {layersLoading ||
            (synthContext?.current?.printLayers || [])?.length < 1
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
              : (synthContext?.current?.printLayers || [])?.map(
                  (layer, indice) => {
                    return <Set key={indice} synthLayer={layer} />;
                  }
                )}
          </div>
        </div>
        <div
          className="relative preG:absolute preG:bottom-6 preG:right-3 sm:right-12 w-full preG:w-fit h-fit flex flex-row gap-1.5 sm:gap-3 text-white items-center justify-center text-center cursor-pointer md:pt-0 pt-4 order-3 preG:order-2"
          onClick={() => {
            context?.setPrerollAnim(true);
            window.innerWidth < 1280 && scrollToPreroll();
          }}
        >
          <div
            className="relative w-fit h-fit items-center justify-center flex font-herm text-sm sm:text-lg"
            id="arrowsLeft"
          >{`<<<`}</div>
          <div
            className={`relative w-fit h-fit items-center justify-center text-center flex font-mega uppercase pr-1 ${
              path?.includes("/en/")
                ? "text-sm sm:text-base lg:text-2xl synth:text-3xl"
                : "text-xs sm:text-base lg:text-xl"
            } `}
          >
            {dict?.Common?.buy}
          </div>
          <div
            className="relative w-fit h-fit items-center justify-center flex font-herm text-sm  sm:text-lg"
            id="arrowsRight"
          >{`>>>`}</div>
        </div>
        <div
          className={`relative w-full flex justify-center preG:w-auto preG:absolute text-white text-sm sm:text-xl tablet:text-3xl uppercase pt-2 preG:pt-0 preG:bottom-4 order-2 preG:order-3 ${
            path?.includes("/es/") ? "font-bit" : "font-mana"
          }`}
          draggable={false}
        >
          {dict?.Common?.layer}
        </div>
      </div>
    </div>
  );
};

export default Layer;
