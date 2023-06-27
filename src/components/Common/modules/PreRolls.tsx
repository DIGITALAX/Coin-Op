import { FunctionComponent } from "react";
import {
  PreRoll as PreRollInterface,
  PreRollsProps,
} from "../types/common.types";
import PreRoll from "./PreRoll";

const PreRolls: FunctionComponent<PreRollsProps> = ({
  preRoll,
}): JSX.Element => {
  return (
    <div className="relative w-72 h-full flex overflow-y-scroll">
      <div className="relative w-full h-fit flex flex-col justify-start items-center gap-10">
        {preRoll?.map((preRoll: PreRollInterface, index: number) => {
          return <PreRoll key={index} preRoll={preRoll} />;
        })}
      </div>
    </div>
  );
};

export default PreRolls;
