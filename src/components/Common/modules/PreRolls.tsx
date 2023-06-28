import { FunctionComponent } from "react";
import {
  PreRoll as PreRollInterface,
  PreRollsProps,
} from "../types/common.types";
import PreRoll from "./PreRoll";

const PreRolls: FunctionComponent<PreRollsProps> = ({
  dispatch,
  cartItems,
  preRolls,
  left,
  right,
}): JSX.Element => {
  return (
    <div className="relative w-80 h-[60rem] flex overflow-y-scroll">
      <div className="relative w-full h-fit flex flex-col justify-start items-center gap-10">
        {(left ? preRolls.left : preRolls.right)?.map(
          (preRoll: PreRollInterface, index: number) => {
            return (
              <PreRoll
                key={index}
                preRoll={preRoll}
                cartItems={cartItems}
                dispatch={dispatch}
                preRolls={preRolls}
                left={left}
                right={right}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default PreRolls;
