import { FunctionComponent } from "react";
import { HookProps } from "../types/common.types";

const Hook: FunctionComponent<HookProps> = ({ preRollRef }): JSX.Element => {
  return (
    <div
      className="font-monu text-white text-5xl flex flex-col items-center justify-center w-3/4 h-fit break-words text-center"
      ref={preRollRef}
    >
      this is where the hook phrase goes.
    </div>
  );
};

export default Hook;
