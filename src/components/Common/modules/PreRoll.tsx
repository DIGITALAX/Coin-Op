import { FunctionComponent } from "react";
import { PreRollProps } from "../types/common.types";
import Image from "next/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import PrintTag from "./PrintTag";
import ColorChoice from "./ColorChoice";
import { setCart } from "../../../../redux/reducers/cartSlice";

const PreRoll: FunctionComponent<PreRollProps> = ({
  preRoll,
  dispatch,
  cartItems,
  preRolls,
  left,
  right
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col rounded-sm border border-white p-3 gap-5">
      <div className="relative w-full h-80 flex flex-col object-cover">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${preRoll.image}`}
          fill
          draggable={false}
          alt="preRoll"
        />
      </div>
      <div className="relative flex flex-row gap-2 w-full h-fit justify-between">
        <PrintTag backgroundColor={preRoll.bgColor} type={preRoll.type} />
        <ColorChoice
          dispatch={dispatch}
          preRolls={preRolls}
          preRoll={preRoll}
          left={left}
          right={right}
        />
      </div>
      <div className="relative flex flex-row gap-2 w-full h-fit">
        <div className="relative text-xl text-white font-aqua flex justify-start items-start w-fit h-fit">
          ${preRoll.price}
        </div>
        <div
          className="relative text-xl text-white font-aqua flex justify-end ml-auto w-6 h-6 cursor-pointer active:scale-95"
          onClick={() => dispatch(setCart([...cartItems, preRoll]))}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/Qmbk9wDd5oAJLBVqJAktbSR8xbXcDfYLSwQcxP9DYrrt1P`}
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
