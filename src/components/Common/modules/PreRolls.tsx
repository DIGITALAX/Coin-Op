import { FunctionComponent } from "react";
import {
  PreRoll as PreRollInterface,
  PreRollsProps,
} from "../types/common.types";
import PreRoll from "./PreRoll";
import usePreRoll from "../hooks/usePreRoll";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const PreRolls: FunctionComponent<PreRollsProps> = ({
  left,
  right,
}): JSX.Element => {
  const dispatch = useDispatch();
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const preRollAnim = useSelector(
    (state: RootState) => state.app.preRollAnimReducer.value
  );
  const { preRollsLoading } = usePreRoll();
  return (
    <div className="relative w-full md:min-w-80 md:w-80 h-fit md:h-full flex overflow-x-scroll md:overflow-y-scroll">
      <div className="relative w-fit md:w-full h-fit flex flex-row md:flex-col justify-start items-center gap-10">
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
