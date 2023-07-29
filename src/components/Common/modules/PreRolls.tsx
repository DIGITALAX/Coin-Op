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
  preRollAnim,
  preRollsLoading,
}): JSX.Element => {
  return (
    <div className="relative min-w-80 w-80 h-full flex overflow-y-scroll">
      <div className="relative w-full h-fit flex flex-col justify-start items-center gap-10">
        {preRollsLoading
          ? Array.from({ length: 40 }).map((_, index: number) => {
              return (
                <div
                  className="relative w-full h-80 flex flex-col rounded-sm border border-white p-3"
                  key={index}
                >
                  <div
                    className="relative w-full h-full flex flex-col"
                    id={"staticLoad"}
                  ></div>
                </div>
              );
            })
          : (left ? preRolls.left : preRolls.right)?.map(
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
                    preRollAnim={preRollAnim}
                  />
                );
              }
            )}
      </div>
    </div>
  );
};

export default PreRolls;
