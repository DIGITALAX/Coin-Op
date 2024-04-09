import { FunctionComponent } from "react";
import { HookProps } from "../types/common.types";

const Hook: FunctionComponent<HookProps> = ({ prerollRef, t }): JSX.Element => {
  return (
    <div
      className="font-monu text-white text-3xl preG:text-5xl flex flex-col items-center justify-center w-3/4 h-fit break-words text-center order-1 pt-2 sm:pt-0 sm:order-3"
      ref={prerollRef}
      draggable={false}
    >
      {t("hook")}
    </div>
  );
};

export default Hook;
