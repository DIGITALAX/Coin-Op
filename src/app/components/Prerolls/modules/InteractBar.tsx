import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import numeral from "numeral";
import { AiOutlineLoading } from "react-icons/ai";
import { CartItem, InteractBarProps } from "../types/prerolls.types";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import useInteractions from "../hooks/useInteractions";

const InteractBar: FunctionComponent<InteractBarProps> = ({
  dict,
  preroll,
}): JSX.Element => {
  const {
    openMirrorChoice,
    setOpenMirrorChoice,
    interactionLoading,
    handleLike,
    handleMirror,
    interactions,
  } = useInteractions(dict, preroll?.publication!);
  const context = useContext(ModalContext);
  return (
    <div
      className={`relative w-full h-fit rounded-sm border border-white font-vcr text-white flex gap-4 p-2 items-center justify-center z-10 flex-row text-xxs`}
    >
      {[
        {
          image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
          title: dict?.Common?.mirs as string,
          responded: interactions?.hasReposted || interactions?.hasQuoted,
          function: () => setOpenMirrorChoice(!openMirrorChoice),
          loader: false,
          stat: (interactions?.reposts || 0) + (interactions?.quotes || 0),
        },
        {
          image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
          title: dict?.Common?.like as string,
          responded: interactions?.hasUpvoted,
          function: () =>
            handleLike(
              preroll?.publication?.id!,
              interactions?.hasUpvoted ? "DOWNVOTE" : "UPVOTE"
            ),
          loader: interactionLoading?.like,
          stat: interactions?.upvotes || 0,
        },
        {
          image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
          title: dict?.Common?.comm as string,
          responded: false,
          function: () =>
            context?.setQuoteBox({
              type: "comment",
              quote: preroll?.publication!,
            }),
          loader: false,
          stat: interactions?.comments || 0,
        },
        {
          image: "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
          title: "Acts",
          responded: interactions?.hasSimpleCollected,
          function: () => {
            const existing = [...(context?.cartItems || [])].findIndex(
              (item) =>
                item?.item?.collectionId === preroll?.collectionId &&
                item.chosenSize === preroll?.chosenSize &&
                item.chosenColor === preroll?.chosenColor
            );

            let newCartItems: CartItem[] = [...(context?.cartItems || [])];

            if (
              Number(
                context?.cartItems
                  ?.filter(
                    (item) =>
                      item?.item?.postId ==
                      newCartItems?.[existing]?.item?.postId
                  )
                  ?.reduce(
                    (accumulator, currentItem) =>
                      accumulator + currentItem.chosenAmount,
                    0
                  )
              ) +
                1 >
                Number(newCartItems?.[existing]?.item?.amount) ||
              Number(newCartItems?.[existing]?.item?.amount) ==
                Number(newCartItems?.[existing]?.item?.tokenIdsMinted?.length)
            ) {
              context?.setModalOpen(dict?.Common?.eager);

              return;
            }

            if (existing !== -1) {
              newCartItems = [
                ...newCartItems.slice(0, existing),
                {
                  ...newCartItems[existing],
                  chosenAmount: newCartItems[existing].chosenAmount + 1,
                },
                ...newCartItems.slice(existing + 1),
              ];
            } else {
              newCartItems.push({
                item: preroll,
                chosenColor: preroll?.chosenColor,
                chosenSize: preroll?.chosenSize,
                chosenAmount: 1,
                chosenIndex:
                  preroll?.printType !== "0" && preroll?.printType !== "1"
                    ? 0
                    : preroll?.metadata?.sizes?.indexOf(preroll?.chosenSize),
              });
            }

            context?.setCartItems(newCartItems);
            context?.setCartAddAnim(preroll?.metadata?.images[0]);
          },
          loader: false,
          stat: interactions?.collects || 0,
        },
      ].map(
        (
          value: {
            image: string;
            title: string;
            responded: boolean;
            function: () => void;
            loader: boolean;
            stat: number;
          },
          indexTwo: number
        ) => {
          return (
            <div
              className="relative w-full h-full flex flex-row items-center justify-center gap-2"
              key={indexTwo}
              title={value?.title}
            >
              <div
                className={`relative w-fit h-fit flex items-center justify-center ${
                  value?.responded && "mix-blend-hard-light hue-rotate-60"
                } ${
                  preroll?.publication?.actions?.[0]?.__typename ===
                  "SimpleCollectAction"
                    ? "cursor-pointer active:scale-95"
                    : "opacity-70"
                }`}
                onClick={async () => value.function()}
              >
                {value?.loader ? (
                  <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                    <AiOutlineLoading size={15} color="white" />
                  </div>
                ) : (
                  <div
                    className={`relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95`}
                  >
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${value?.image}`}
                      draggable={false}
                    />
                  </div>
                )}
              </div>
              {
                <div
                  className={`relative w-fit h-fit flex items-center justify-center text-center ${
                    Number(value?.stat) > 0 && "cursor-pointer active:scale-95"
                  }`}
                  onClick={() =>
                    Number(value?.stat) > 0 &&
                    context?.setReactBox({
                      id: preroll?.publication?.id!,
                      type: value?.title,
                    })
                  }
                >
                  {numeral(value?.stat).format("0a")}
                </div>
              }
            </div>
          );
        }
      )}
      {openMirrorChoice && (
        <div
          className={`absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-black/80 rounded-sm -top-6 left-0`}
        >
          {[
            {
              title: dict?.Common?.mirror,
              image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
              function: () => handleMirror(preroll?.publication?.id!),
              loader: interactionLoading?.mirror,
            },
            {
              title: dict?.Common?.quote,
              image: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
              function: () =>
                context?.setQuoteBox({
                  type: "quote",
                  quote: preroll?.publication!,
                }),

              loader: false,
            },
          ].map(
            (
              value: {
                image: string;
                title: string;
                function: () => void;
                loader: boolean;
              },
              indexTwo: number
            ) => {
              return (
                <div
                  key={indexTwo}
                  className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                  onClick={() => !value?.loader && value?.function()}
                >
                  {value?.loader ? (
                    <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                      <AiOutlineLoading size={15} color="white" />
                    </div>
                  ) : (
                    <div
                      className={`relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95`}
                    >
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${value?.image}`}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default InteractBar;
