import { FunctionComponent, JSX } from "react";
import { PrintTagProps } from "../types/prerolls.types";

const PrintTag: FunctionComponent<PrintTagProps> = ({
  backgroundColor,
  type,
  dict,
}): JSX.Element => {
  return (
    <div
      className="relative flex flex-row w-fit px-1.5 py-1 h-fit text-white font-monu gap-1 items-center justify-center"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="relative w-2 h-2 rounded-full bg-white flex items-center justify-center"></div>
      <div className="relative w-fit h-fit flex items-center justify-center text-xxs">
        {dict?.Common?.[type?.toLowerCase()]}
      </div>
    </div>
  );
};
export default PrintTag;
