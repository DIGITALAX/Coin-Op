import { FunctionComponent } from "react";
import { PreRollProps } from "../types/common.types";
import Image from "next/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import PrintTag from "./PrintTag";
import ColorChoice from "./ColorChoice";

const PreRoll: FunctionComponent<PreRollProps> = ({ preRoll }): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col rounded-sm border border-white p-3">
      <div className="relative w-full h-60 flex flex-col object-cover">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${preRoll.image}`}
          fill
          draggable={false}
          alt="preRoll"
        />
      </div>
      <div className="relative flex flex-row gap-2 w-full h-fit">
        <PrintTag backgroundColor={preRoll.bgColor} type={preRoll.type} />
        <ColorChoice colors={preRoll.colors} />
      </div>
      <div className="relative flex flex-row gap-2 w-full h-fit">
        <div className="relative text-xl text-white font-aqua flex justify-start items-start w-fit h-fit">
          ${preRoll.price}
        </div>
        <div className="relative text-xl text-white font-aqua flex justify-end ml-auto w-6 h-6">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/`}
            fill
            draggable={false}
            alt="preRoll"
          />
        </div>
      </div>
    </div>
  );
};

export default PreRoll;
