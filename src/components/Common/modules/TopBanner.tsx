import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { TFunction } from "i18next";

const TopBanner: FunctionComponent<{ t: TFunction<"common", undefined> }> = ({
  t,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit preG:h-24 items-center justify-center flex">
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
            {t("know")}
          </div>
        </div>
        <div className="relative w-1.5 h-full bg-black"></div>
        <div className="relative w-fit h-fit items-center justify-center flex flex-col text-center">
          <div className="relative w-fit h-fit items-center justify-center flex font-satB whitespace-nowrap">
            {t("mac")}
          </div>
          <div className="relative w-fit h-fit items-center justify-center flex text-sm">
            {t("start")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBanner;
