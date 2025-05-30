import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { usePathname } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import templates from "../../../../../../public/templates.json";
import { SynthContext } from "@/app/providers";
import Template from "./Template";

const Format: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const path = usePathname();
  const synthContext = useContext(SynthContext);

  return (
    <div className="relative w-full h-fit flex flex-col">
      <div className="relative w-full h-100 flex flex-col gap-2">
        <div className="absolute w-full h-full hidden preG:flex">
          <Image
            alt="copy"
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
            draggable={false}
          />
        </div>
        <div
          className="relative w-full h-3/4 flex overflow-x-scroll"
          id="xScroll"
        >
          <div className="relative w-fit md:w-full inline-flex h-full px-7 pt-4 gap-4">
            {templates?.slice(0, 4)?.map((template, index: number) => {
              return (
                <Template
                  dict={dict}
                  template={template}
                  key={index}
                  chosenTemplate={synthContext?.current?.template}
        
                />
              );
            })}
          </div>
        </div>
        <div className="relative w-full flex flex-col preG:flex-row h-fit px-5 md:px-7 gap-5">
          <div className="flex flex-row w-full h-fit justify-between">
            <div className="relative flex flex-row gap-2 w-fit h-fit">
              <div className="relative w-8 h-4 sm:w-12 sm:h-5 hidden preG:flex">
                <Image
                  alt="seeAll"
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmXvzWPiUqMw6umcS3Qp6yXCTwLzZtbXcWH8fKE6i3ZFpY`}
                  draggable={false}
                />
              </div>
              <div className="relative w-8 h-4 sm:w-12 sm:h-5 flex">
                <Image
                  alt="seeAll"
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmXvzWPiUqMw6umcS3Qp6yXCTwLzZtbXcWH8fKE6i3ZFpY`}
                  draggable={false}
                />
              </div>
            </div>
            <div className="relative w-fit h-fit text-white font-mega flex break-words text-right text-xxs sm:text-xs md:text-base md:pl-0 pl-2 whitespace-pre-line">
              {dict?.Common?.unlock}
            </div>
          </div>
          <div
            className="relative w-full h-fit flex overflow-x-scroll md:pl-0 pl-4"
            id="xScroll"
          >
            <div className="relative w-fit md:w-full h-20 flex flex-row gap-3">
              {templates?.slice(4)?.map((template, index: number) => {
                return (
                  <Template
                    template={template}
                    key={index}
                    dict={dict}
                    chosenTemplate={synthContext?.current?.template}
                    locked={true}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col absolute w-fit h-fit gap-1.5 bottom-40 px-5 preG:px-0 preG:right-auto preG:-bottom-2 sm:-bottom-5 synth:-bottom-3">
          <div
            className={`relative text-base sm:text-2xl tablet:text-4xl uppercase flex text-white ${
              path?.includes("/es/") ? "font-bit" : "font-mana"
            }`}
            draggable={false}
          >
            {dict?.Common?.format}
          </div>
          <div
            className={`relative flex font-sat text-bb w-2/3 break-all synth:w-fit h-fit ${
              path?.includes("/en/") ? "text-xxs" : "text-xxxs"
            }`}
          >
            {dict?.Common?.eth}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Format;
