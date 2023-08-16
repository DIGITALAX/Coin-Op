import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { QuestStatsProps } from "../types/quests.types";

const QuestStats: FunctionComponent<QuestStatsProps> = ({
  questInfo,
  getQuestInformation,
  connected,
  chain,
  openChainModal,
  questsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-center gap-10 px-4 pt-2">
      <div className="relative w-full h-fit inline-flex items-center justify-between gap-10 900:gap-3 px-4 py-2 flex-wrap">
        <div className="relative w-fit h-fit flex flex-col items-center justify-start gap-2">
          <div className="relative w-full font-vcr h-fit justify-start items-center text-white text-sm sm:text-lg flex">
            Quests Completed
          </div>
          <div className="relative w-full h-fit flex items-center justify-start">
            {questInfo?.questsCompleted ? (
              <div className="relative w-fit h-fit flex items-center justify-center text-3xl font-vcr text-sol">
                {questInfo?.questsCompleted}
              </div>
            ) : (
              <div className="relative w-28 h-12 flex blur-sm">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmSfy22hgs5NdtBfT3tEug3aRV376HuGD2tVbh6Hn71Uj1`}
                  layout="fill"
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-col items-center justify-center gap-2">
          <div className="relative w-full font-vcr h-fit justify-start items-center text-white text-sm sm:text-lg flex">
            Prelude Quests Remaining
          </div>
          <div className="relative w-full h-fit flex items-center justify-start">
            {questInfo?.questsCompleted ? (
              <div className="relative w-fit h-fit flex items-center justify-center text-3xl font-vcr text-sol">
                {Number(questInfo?.totalQuests) -
                  Number(questInfo?.questsCompleted)}
              </div>
            ) : (
              <div className="relative w-28 sm:w-40 h-12 flex blur-sm">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmSfy22hgs5NdtBfT3tEug3aRV376HuGD2tVbh6Hn71Uj1`}
                  layout="fill"
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-col items-center justify-center gap-2">
          <div className="relative w-full font-vcr h-fit justify-start items-center text-white text-sm sm:text-lg flex">
            Total Point Score
          </div>
          <div className="relative w-full h-fit flex items-center justify-start">
            {questInfo?.pointScore ? (
              <div className="relative w-fit h-fit flex items-center justify-center text-3xl font-vcr text-sol">
                {questInfo?.pointScore}
              </div>
            ) : (
              <div className="relative w-28 h-12 flex blur-sm">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmSfy22hgs5NdtBfT3tEug3aRV376HuGD2tVbh6Hn71Uj1`}
                  layout="fill"
                  draggable={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {connected &&
        (questInfo?.participantId || Number(questInfo?.participantId) > 1) && (
          <div className="relative w-full h-fit flex justify-center items-center flex flex-col gap-4">
            <div className="relative text-sm font-vcr text-white flex items-center justify-center">
              Collected Keys since your last visit? Update your prelude quest
              status:
            </div>
            <div
              className={`relative whitespace-nowrap w-fit px-7 py-1.5 h-fit items-center justify-center border border-ama cursor-pointer active:scale-95`}
              onClick={
                connected && chain !== 137
                  ? openChainModal
                  : () => !questsLoading && getQuestInformation()
              }
            >
              <div className="relative w-fit h-fit items-center justify-center flex font-vcr text-white text-xs">
                refresh quests
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default QuestStats;
