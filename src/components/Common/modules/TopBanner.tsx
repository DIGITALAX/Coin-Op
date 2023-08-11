import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";

const TopBanner: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit preG:h-20 items-center justify-center flex">
      <div className="relative w-full preG:w-fit px-4 py-2 h-fit preG:h-full rounded-sm bg-oscurazul font-sat text-white flex flex-col preG:flex-row items-center justify-center gap-5">
        <div className="relative w-14 h-11 items-center justify-center flex">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmfVta8TP8BmZqo6Pvh6PgosRBM9mm71txukUxQp9fri17`}
            layout="fill"
            objectFit="cover"
            draggable={false}
          />
        </div>
        <div
          className="relative w-full h-full overflow-y-scroll flex"
          id="xScroll"
        >
          <div className="relative w-fit h-fit break-words items-center justify-center">
            We know it&apos;s a lot to keep up with. How can you know if this is
            the blend of instant convenience and purchasing power you&apos;ve
            been waiting for?
          </div>
        </div>
        <div className="relative w-1.5 h-full bg-black"></div>
        <div className="relative w-fit h-fit items-center justify-center flex flex-col text-center">
          <div className="relative w-fit h-fit items-center justify-center flex font-satB whitespace-nowrap">
            Ask a machine
          </div>
          <div className="relative w-fit h-fit items-center justify-center flex text-sm">
            or, just start here
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
