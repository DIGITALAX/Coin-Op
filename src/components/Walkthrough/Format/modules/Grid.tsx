import Image from "next/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps, Template } from "../types/format.types";

const Grid: FunctionComponent<GridProps> = ({
  templates,
  setTemplate,
  template,
}): JSX.Element => {
  return (
    <div className="relative w-full h-100 flex flex-col gap-2">
      <div className="absolute w-full h-full flex">
        <Image
          alt="copy"
          fill
          src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
          draggable={false}
        />
      </div>
      <div className="relative w-full inline-flex h-fit">
        {templates?.map((value: Template, index: number) => {
          return <div key={index} className="relative cursor-pointer hover:opacity-80">
            
          </div>;
        })}
      </div>
      <div className="relative w-full flex flex-row gap-3 h-fit"></div>
    </div>
  );
};

export default Grid;
