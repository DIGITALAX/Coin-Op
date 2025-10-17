import { FunctionComponent, JSX, useState } from "react";
import { AppMarketProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, WALKTHROUGH_IMAGES } from "@/app/lib/constants";

const Walkthrough: FunctionComponent<AppMarketProps> = ({
  dict,
}): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  return (
    <div className="relative w-full h-fit flex flex-col gap-4 justify-start items-start pt-8">
      <div className="font-count flex text-xl w-fit h-fit text-white uppercase">
        {dict?.Common?.walkthrough}
      </div>
      <div className="relative w-full bg-black border border-rillo rounded-md">
        <Image
          layout="responsive"
          draggable={false}
          width={2820}
          height={1852}
          objectFit="contain"
          className="rounded-md"
          src={`${INFURA_GATEWAY}/ipfs/${WALKTHROUGH_IMAGES[currentIndex]?.image}`}
          alt={dict?.Common?.[WALKTHROUGH_IMAGES[currentIndex]?.title]}
        />
      </div>
      <div className="relative w-full h-fit flex flex-row justify-between gap-10 md:flex-nowrap flex-wrap">
        <div className="relative w-fit h-fit grid grid-cols-3 gap-2">
          {WALKTHROUGH_IMAGES.map((_, i) => (
            <div key={i} className="relative w-fit h-fit flex">
              <div
                className="relative w-12 h-12 flex cursor-pointer items-center justify-center font-bit text-black text-lg"
                onClick={() => setCurrentIndex(i)}
              >
                <Image
                  layout="fill"
                  objectFit="contain"
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/${
                    i !== currentIndex
                      ? "QmZrUfKgrizrLA2Mts33JmFAt1Jc5KU8EmKGXov4sjYgPr"
                      : "QmeqHCJXLWufYdfbzZer76fRpmF4Ts2xjVr97Nhbcb9FM9"
                  }`}
                />
                <div className="relative w-fit h-fit flex top-0.5">{i + 1}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="relative w-fit h-fit text-left flex-col gap-2 flex font-chic text-[#DAD9C0] break-words">
          <div className="relative w-fit h-fit flex text-4xl">
            {dict?.Common?.[WALKTHROUGH_IMAGES[currentIndex]?.title]}
          </div>
          <div className="relative w-fit h-fit flex text-lg">
            {dict?.Common?.[WALKTHROUGH_IMAGES[currentIndex]?.content]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
