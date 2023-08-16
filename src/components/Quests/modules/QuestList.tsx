import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { QuestListProps } from "../types/quests.types";
import { setQuestPrelude } from "../../../../redux/reducers/questPreludeSlice";
import { setLogin } from "../../../../redux/reducers/loginSlice";
import { setPreRollAnim } from "../../../../redux/reducers/preRollAnimSlice";
import { AiOutlineLoading } from "react-icons/ai";

const QuestList: FunctionComponent<QuestListProps> = ({
  questInfo,
  dispatch,
  connected,
  connectedPKP,
  chain,
  openChainModal,
  questsLoading,
  questPoints,
  router,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-full overflow-y-scroll items-start justify-center flex pb-4 xl:pt-0 pt-10"
      id="xScroll"
    >
      <div className="relative w-11/12 items-center justify-start h-fit flex flex-col gap-3">
        {questsLoading
          ? Array.from({ length: 10 }).map((_, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row justify-center md:justify-between items-center w-full h-24 md:h-16 border border-mist rounded-md font-vcr text-white px-2 py-2 md:py-1 gap-5 animate-pulse`}
                >
                  <div className="relative break-all w-full h-fit items-center justify-center md:justify-start flex text-xs md:text-base">
                    @#$%^&@#$%^&@#$%^&
                  </div>
                  <div className="relative w-fit h-fit flex flex-row gap-5 items-center justify-center">
                    <div
                      className={`relative whitespace-nowrap w-fit px-1.5 py-1 h-fit items-center justify-center border border-ama`}
                    >
                      <div className="relative w-fit h-fit items-center justify-center flex font-vcr text-white text-xxs animate-spin">
                        <AiOutlineLoading size={15} color="white" />
                      </div>
                    </div>
                    <div className="relative w-9 h-8 items-center justify-center flex">
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/QmVcj19r95QW8ooc8tRGkD3AWzDi8S6e1snutwcnVbjoYV`}
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          : (connectedPKP
              ? [
                  {
                    text: "Claim your first sign-in from the prelude quest.",
                    index: 0,
                  },
                  {
                    text: "Subscribe to Kihívás for web3 & AI level up.",
                    function: () => router.push("/subscription"),
                    index: 15,
                  },
                  {
                    text: "Collect coin op shirt preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 2,
                  },
                  {
                    text: "Fulfill coin op shirt preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 3,
                  },
                  {
                    text: "Collect coin op hoodie preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 4,
                  },
                  {
                    text: "Fulfill coin op hoodie preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 5,
                  },
                  {
                    text: "Wallet creation & connect.",
                    index: 13,
                  },
                  {
                    text: "Lens profile claim.",
                    index: 14,
                  },
                ]
              : [
                  {
                    text: "Claim your first sign-in from the prelude quest.",
                    index: 0,
                  },
                  {
                    text: "Mint membership waitlist NFT from The Manufactory.",
                    link: "https://themanufactory.xyz",
                    index: 1,
                  },
                  {
                    text: "Collect coin op shirt preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 2,
                  },
                  {
                    text: "Fulfill coin op shirt preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 3,
                  },
                  {
                    text: "Collect coin op hoodie preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 4,
                  },
                  {
                    text: "Fulfill coin op hoodie preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 5,
                  },
                  {
                    text: "Claim Lens profile (need an invite? send us message on discord).",
                    link: "https://claim.lens.xyz/",
                    index: 6,
                  },
                  {
                    text: "Collect coin op sticker preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 7,
                  },
                  {
                    text: "Fulfill coin op sticker preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 8,
                  },
                  {
                    text: "Collect coin op poster preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 9,
                  },
                  {
                    text: "Fulfill coin op poster preroll.",
                    function: () => dispatch(setPreRollAnim(true)),
                    index: 10,
                  },
                  {
                    text: "Super creator follow on Chromadin.",
                    link: "https://www.chromadin.xyz/#chat?option=history",
                    index: 11,
                  },
                  {
                    text: "Unique or multi edition Chromadin Collect.",
                    link: "https://www.chromadin.xyz/#collect?option=history",
                    index: 12,
                  },
                  {
                    text: "Collect Legend Grant Dynamic NFT.",
                    index: 13,
                  },
                  {
                    text: "Collect Legend Grant apparel item.",
                    index: 14,
                  },
                ]
            ).map(
              (
                item: {
                  text: string;
                  link?: string;
                  function?: () => void;
                  index: number;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className={`relative flex flex-col md:flex-row justify-center md:justify-between items-center w-full h-24 md:h-16 border border-mist rounded-md font-vcr text-white px-2 py-2 md:py-1 gap-5 ${
                      questInfo?.questsCompletedIds.includes(
                        String(item.index)
                      ) && "bg-sol/20"
                    }`}
                  >
                    <div className="relative break-all w-full h-fit items-center justify-center md:justify-start flex text-xs md:text-base">
                      {item.text}
                    </div>
                    <div className="relative w-fit h-fit flex flex-row gap-5 items-center justify-center">
                      <div
                        className={`relative whitespace-nowrap w-fit px-1.5 py-1 h-fit items-center justify-center border border-ama ${
                          (!questInfo?.questsCompletedIds.includes(
                            String(item.index)
                          ) ||
                            item.link ||
                            item.function) &&
                          "cursor-pointer active:scale-95"
                        }`}
                        onClick={
                          !questInfo?.participantId ||
                          Number(questInfo?.participantId) < 1
                            ? !connected && !connectedPKP
                              ? () =>
                                  dispatch(
                                    setLogin({
                                      actionOpen: true,
                                      actionHighlight: undefined,
                                    })
                                  )
                              : connected && chain !== 137
                              ? openChainModal
                              : () => dispatch(setQuestPrelude(true))
                            : item.function
                            ? item.function
                            : () => item.link && window.open(item.link)
                        }
                      >
                        <div className="relative w-fit h-fit items-center justify-center flex font-vcr text-white text-xxs">
                          {item.index === 13 || item.index === 14
                            ? "coming soon"
                            : !questInfo?.participantId ||
                              Number(questInfo?.participantId) < 1
                            ? "claim quest sig"
                            : questInfo?.questsCompletedIds.includes(
                                String(item.index)
                              )
                            ? "completed"
                            : "pending"}
                        </div>
                      </div>
                      {questPoints?.[index] && (
                        <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-sm text-white">
                          {questPoints?.[index]}
                        </div>
                      )}
                      <div className="relative w-9 h-8 items-center justify-center flex">
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmVcj19r95QW8ooc8tRGkD3AWzDi8S6e1snutwcnVbjoYV`}
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                );
              }
            )}
      </div>
    </div>
  );
};

export default QuestList;
