import { FunctionComponent } from "react";

const TopBanner: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit preG:h-20 items-center justify-center flex">
      <div className="relative w-full preG:w-fit px-4 py-2 h-fit preG:h-full rounded-sm bg-oscurazul font-sat text-white flex flex-col preG:flex-row items-center justify-center gap-5">
        <div className="relative w-fit h-fit items-center justify-center flex">
          [icon]
        </div>
        <div
          className="relative w-full h-full overflow-y-scroll flex"
          id="xScroll"
        >
          <div className="relative w-fit h-fit break-words items-center justify-center">
            Something describing the gist of the hook phrase and the site in
            general goes here. It should take up enough space to fill these
            lines.
          </div>
        </div>
        <div className="relative w-1.5 h-full bg-black"></div>
        <div className="relative w-fit h-fit items-center justify-center flex flex-col text-center">
          <div className="relative w-fit h-fit items-center justify-center flex font-satB whitespace-nowrap">
            Action Word
          </div>
          <div className="relative w-fit h-fit items-center justify-center flex text-sm">
            it&apos;s simple
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
