import { ScrollContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";

const Hook: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const scrollContext = useContext(ScrollContext);
  return (
    <div
      className="font-monu text-white text-3xl preG:text-5xl flex flex-col items-center justify-center w-3/4 h-fit break-words text-center order-1 pt-2 sm:pt-0 sm:order-3"
      ref={scrollContext?.prerollRef}
      draggable={false}
    >
      {dict?.Common?.hook}
    </div>
  );
};

export default Hook;
