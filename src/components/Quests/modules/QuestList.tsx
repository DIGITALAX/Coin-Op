import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const QuestList: FunctionComponent = (): JSX.Element => {
  return (
    <div
      className="relative w-full h-full overflow-y-scroll items-start justify-center flex pb-4 xl:pt-0 pt-10"
      id="xScroll"
    >
      <div className="relative w-11/12 items-center justify-start h-fit flex flex-col gap-3">
        {Array.from([
          "Claim your first sign-in from the prelude quest.",
          "Mint membership waitlist NFT from The Manufactory.",
          "Collect & fulfill preroll small sticker pack.",
          "Sign up for Lens profile invite waitlist.",
          "Super creator follow on Chromadin.",
          "Unlock token-gated Chromadin post.",
          "Collect Legend Grant apparel item & Dynamic NFT.",
          "Refill GPU Credits.",
        ]).map((item: string, index: number) => {
          return (
            <div
              key={index}
              className="relative flex flex-col md:flex-row justify-center md:justify-between items-center w-full h-24 md:h-16 border border-mist rounded-md font-vcr text-white px-2 py-2 md:py-1 gap-5"
            >
              <div className="relative break-all w-full h-fit items-center justify-center md:justify-start flex text-xs md:text-base">
                {item}
              </div>
              <div className="relative w-fit h-fit flex flex-row gap-5 items-center justify-center">
                <div className="relative whitespace-nowrap w-fit px-1.5 py-1 h-fit items-center justify-center border border-ama">
                  <div className="relative w-fit h-fit items-center justify-center flex font-vcr text-white text-xxs">
                    start quest
                  </div>
                </div>
                <div className="relative w-9 h-8 items-center justify-center flex">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmVcj19r95QW8ooc8tRGkD3AWzDi8S6e1snutwcnVbjoYV`}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestList;
