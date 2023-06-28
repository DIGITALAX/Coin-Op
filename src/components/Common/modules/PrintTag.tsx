import { FunctionComponent } from "react";
import { PrintTagProps } from "../types/common.types";

const PrintTag: FunctionComponent<PrintTagProps> = ({
  backgroundColor,
  type,
}): JSX.Element => {
  return (
    <div
      className="relative flex flex-row w-fit px-1.5 py-1 h-fit text-white font-monu gap-1 items-center justify-center"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="relative w-2 h-2 rounded-full bg-white flex items-center justify-center"></div>
      <div className="relative w-fit h-fit flex items-center justify-center text-xxs">
        {type}
      </div>
    </div>
  );
};
export default PrintTag;
