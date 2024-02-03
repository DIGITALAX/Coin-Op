import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Image from "next/legacy/image";
import numeral from "numeral";
import { AiOutlineLoading } from "react-icons/ai";
import { CartItem, InteractBarProps } from "../../types/common.types";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import { setCartAddAnim } from "../../../../../redux/reducers/cartAddAnimSlice";
import { setModalOpen } from "../../../../../redux/reducers/modalOpenSlice";
import { setQuoteBox } from "../../../../../redux/reducers/quoteBoxSlice";
import { setReactBox } from "../../../../../redux/reducers/reactBoxSlice";

const InteractBar: FunctionComponent<InteractBarProps> = ({
  mirror,
  like,
  interactionsLoading,
  publication,
  openMirrorChoice,
  setOpenMirrorChoice,
  index,
  dispatch,
  cartItems,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit rounded-sm border border-white font-vcr text-white flex gap-4 p-2 items-center justify-center z-10 flex-row text-xxs`}
    >
      {[
        {
          image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
          title: "Mirrors",
          responded:
            publication?.publication?.operations?.hasMirrored! ||
            publication?.publication?.operations?.hasQuoted!,
          function: () =>
            setOpenMirrorChoice((prev) => {
              const arr = [...prev];
              arr[index] = !arr[index];

              return arr;
            }),
          loader: false,
          stat:
            (publication?.publication?.stats?.mirrors || 0) +
            (publication?.publication?.stats?.quotes || 0),
        },
        {
          image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
          title: "Likes",
          responded: publication?.publication?.operations?.hasReacted!,
          function: () =>
            like(
              publication?.publication?.id,
              publication?.publication?.operations?.hasReacted!
            ),
          loader: interactionsLoading?.[index]?.like,
          stat: publication?.publication?.stats?.reactions || 0,
        },
        {
          image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
          title: "Comments",
          responded: false,
          function: () =>
            dispatch(
              setQuoteBox({
                actionType: "comment",
                actionOpen: true,
                actionQuote: publication?.publication,
              })
            ),
          loader: false,
          stat: publication?.publication?.stats?.comments || 0,
        },
        {
          image: "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
          title: "Acts",
          responded:
            publication?.publication?.operations?.hasActed?.isFinalisedOnchain!,
          function: () => {
            const existing = [...cartItems].findIndex(
              (item) =>
                item?.item?.collectionId === publication.collectionId &&
                item.chosenSize === publication.chosenSize &&
                item.chosenColor === publication.chosenColor
            );

            let newCartItems: CartItem[] = [...cartItems];

            if (
              cartItems
              ?.filter(
                (item) =>
                  item?.item?.pubId == newCartItems?.[existing]?.item?.pubId
              )
              ?.reduce(
                (accumulator, currentItem) =>
                  accumulator + currentItem.chosenAmount,
                0
              ) +
              1 >
              Number(newCartItems?.[existing]?.item?.amount) ||
              Number(newCartItems?.[existing]?.item?.amount) ==
                Number(newCartItems?.[existing]?.item?.soldTokens)
            ) {
              dispatch(
                setModalOpen({
                  actionOpen: true,
                  actionMessage:
                    "We know you're eager, but you've reached this prints' collect limit!",
                })
              );
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
                item: publication,
                chosenColor: publication?.chosenColor,
                chosenSize: publication?.chosenSize,
                chosenAmount: 1,
                chosenIndex:
                  publication?.printType !== "0" &&
                  publication?.printType !== "1"
                    ? 0
                    : publication?.collectionMetadata?.sizes?.indexOf(
                        publication?.chosenSize
                      ),
              });
            }

            dispatch(setCart(newCartItems));
            dispatch(
              setCartAddAnim(publication?.collectionMetadata?.images[0])
            );
          },
          loader: false,
          stat: publication?.publication?.stats?.countOpenActions || 0,
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
                  publication?.publication?.openActionModules?.[0]
                    ?.__typename === "SimpleCollectOpenActionSettings" ||
                  publication?.publication?.openActionModules?.[0]
                    ?.__typename ===
                    "MultirecipientFeeCollectOpenActionSettings"
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
                    dispatch(
                      setReactBox({
                        actionOpen: true,
                        actionId: publication?.publication?.id,
                        actionType: value?.title,
                      })
                    )
                  }
                >
                  {numeral(value?.stat).format("0a")}
                </div>
              }
            </div>
          );
        }
      )}
      {openMirrorChoice?.[index] && (
        <div
          className={`absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-black/80 rounded-sm -top-6 left-0`}
        >
          {[
            {
              title: "Mirror",
              image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
              function: () => mirror(publication?.publication?.id),
              loader: interactionsLoading[index]?.mirror,
            },
            {
              title: "Quote",
              image: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
              function: () =>
                dispatch(
                  setQuoteBox({
                    actionType: "quote",
                    actionOpen: true,
                    actionQuote: publication?.publication,
                  })
                ),
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
