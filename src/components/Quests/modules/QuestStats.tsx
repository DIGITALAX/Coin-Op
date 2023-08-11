import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";

const QuestStats: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-fit inline-flex items-center justify-between gap-10 900:gap-3 px-4 py-2 xl:top-auto top-20 flex-wrap">
      <div className="relative w-fit h-fit flex flex-col items-center justify-start gap-2">
        <div className="relative w-full font-vcr h-fit justify-start items-center text-white text-sm sm:text-lg flex">
          Quest Completed
        </div>
        <div className="relative w-full h-fit flex items-center justify-start">
          <div className="relative w-28 h-12 flex blur-sm">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmSfy22hgs5NdtBfT3tEug3aRV376HuGD2tVbh6Hn71Uj1`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit flex flex-col items-center justify-center gap-2">
        <div className="relative w-full font-vcr h-fit justify-start items-center text-white text-sm sm:text-lg flex">
          Available Quests Remaining
        </div>
        <div className="relative w-full h-fit flex items-center justify-start">
          <div className="relative w-28 sm:w-40 h-12 flex blur-sm">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmSfy22hgs5NdtBfT3tEug3aRV376HuGD2tVbh6Hn71Uj1`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit flex flex-col items-center justify-center gap-2">
        <div className="relative w-full font-vcr h-fit justify-start items-center text-white text-sm sm:text-lg flex">
          Keys Collected
        </div>
        <div className="relative w-full h-fit flex items-center justify-start">
          <div className="relative w-28 h-12 flex blur-sm">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmSfy22hgs5NdtBfT3tEug3aRV376HuGD2tVbh6Hn71Uj1`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestStats;
