import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import {
  GridProps,
  Template as TemplateInterface,
} from "../types/format.types";
import Template from "./Template";

const Grid: FunctionComponent<GridProps> = ({
  templates,
  template,
  dispatch,
}): JSX.Element => {
  return (
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
          {templates
            ?.slice(0, 4)
            ?.map((value: TemplateInterface, index: number) => {
              return (
                <Template
                  template={value}
                  key={index}
                  dispatch={dispatch}
                  chosenTemplate={template}
                  height="20rem"
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
          <div className="relative w-fit h-fit text-white font-mega flex break-words text-right text-xxs sm:text-xs md:text-base md:pl-0 pl-2">
            or level up <br /> to unlock more
          </div>
        </div>
        <div
          className="relative w-full h-fit flex overflow-x-scroll md:pl-0 pl-4"
          id="xScroll"
        >
          <div className="relative w-fit md:w-full h-fit flex flex-row gap-3">
            {templates
              ?.slice(4)
              ?.map((value: TemplateInterface, index: number) => {
                return (
                  <Template
                    template={value}
                    key={index}
                    chosenTemplate={template}
                    height="6.5rem"
                    dispatch={dispatch}
                    locked={true}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div
        className="absolute text-white font-mana text-base sm:text-2xl 900:text-4xl uppercase bottom-48 preG:bottom-4"
        draggable={false}
      >
        choose format
      </div>
    </div>
  );
};

export default Grid;
