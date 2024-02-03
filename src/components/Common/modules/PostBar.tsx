import { FunctionComponent } from "react";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { ImageMetadataV3, Post } from "../types/generated";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { COIN_OP_OPEN_ACTION, INFURA_GATEWAY } from "../../../../lib/constants";
import numeral from "numeral";
import { setQuoteBox } from "../../../../redux/reducers/quoteBoxSlice";
import { PostBarProps } from "../types/common.types";
import { setReactBox } from "../../../../redux/reducers/reactBoxSlice";

const PostBar: FunctionComponent<PostBarProps> = ({
  index,
  like,
  mirror,
  dispatch,
  simpleCollect,
  interactionsLoading,
  item,
  openMirrorChoice,
  setOpenMirrorChoice,
  router,
  disabled,
}): JSX.Element => {
  const profilePicture = createProfilePicture(item?.by?.metadata?.picture);
  return (
    <div className="relative w-full justify-between flex flex-col sm:flex-row items-between sm:items-center gap-2 bg-mist p-1">
      <div className="relative w-fit h-fit flex flex-row items-start sm:items-center gap-2 justify-center">
        {[
          {
            image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            title: "Mirrors",
            function: () =>
              setOpenMirrorChoice!((prev) => {
                const choices = [...prev!];
                choices[index] = !choices[index];
                return choices;
              }),
            stat: item?.stats?.mirrors || 0 || item?.stats?.quotes || 0,
            responded:
              item?.operations?.hasMirrored || item?.operations?.hasQuoted,
            loader: false,
          },
          {
            image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
            title: "Likes",
            function: () => like(item?.id, item?.operations?.hasReacted),
            stat: item?.stats?.reactions || 0,
            responded: item?.operations?.hasReacted,
            loader: interactionsLoading?.[index]?.like,
          },
          {
            image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
            title: "Comments",
            function: () =>
              dispatch(
                setQuoteBox({
                  actionType: "comment",
                  actionOpen: true,
                  actionQuote: item,
                })
              ),
            stat: item?.stats?.comments || 0,
            responded: false,
            loader: false,
          },
          {
            image: "QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4",
            title: "Collects",
            function: () =>
              item?.openActionModules?.[0]?.__typename &&
              simpleCollect(
                item?.id,
                item?.openActionModules?.[0]?.__typename!
              ),
            stat: item?.stats?.comments || 0,
            responded: false,
            loader: interactionsLoading?.[index]?.collect,
          },
        ].map(
          (
            value: {
              image: string;
              title: string;
              stat: number;
              loader: boolean;
              responded: boolean;
              function: () => void;
            },
            indexTwo: number
          ) => {
            return (
              <div
                className={`relative w-full h-full flex flex-row items-center justify-center gap-1 font-satB text-black`}
                key={indexTwo}
              >
                <div
                  className={`relative w-fit h-fit flex items-center justify-center ${
                    value?.responded && "mix-blend-hard-light hue-rotate-60"
                  } ${
                    value?.title == "Collects" &&
                    !item?.openActionModules?.[0]?.__typename
                      ? "opacity-50"
                      : "active:scale-95 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (disabled) {
                      item?.openActionModules?.[0]?.contract?.address
                        ?.toLowerCase()
                        ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                        ? router.push(
                            `https://cypher.digitalax.xyz/item/coinop/${(
                              item?.metadata as ImageMetadataV3
                            )?.title?.replaceAll(" ", "_")}`
                          )
                        : router.push(
                            `https://cypher.digitalax.xyz/item/pub/${item?.id}`
                          );
                    } else {
                      !value?.loader && value?.function();
                    }
                  }}
                >
                  {value?.loader ? (
                    <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                      <AiOutlineLoading size={15} color="white" />
                    </div>
                  ) : (
                    <div
                      className={`relative w-3.5 h-3.5 flex items-center justify-center`}
                    >
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${value?.image}`}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
                <div
                  className={`relative w-fit h-fit flex items-center justify-center text-center text-xxs ${
                    (value?.stat > 0 || value?.title === "Comments") &&
                    "cursor-pointer active:scale-95"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (disabled) {
                      item?.openActionModules?.[0]?.contract?.address
                        ?.toLowerCase()
                        ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                        ? router.push(
                            `https://cypher.digitalax.xyz/item/coinop/${(
                              item?.metadata as ImageMetadataV3
                            )?.title?.replaceAll(" ", "_")}`
                          )
                        : router.push(
                            `https://cypher.digitalax.xyz/item/pub/${item?.id}`
                          );
                    } else {
                      dispatch(
                        setReactBox({
                          actionOpen: true,
                          actionId: item?.id,
                          actionType: value?.title,
                        })
                      );
                    }
                  }}
                >
                  {numeral(value?.stat).format("0a")}
                </div>
              </div>
            );
          }
        )}
      </div>
      {openMirrorChoice?.[index] && (
        <div
          className={`absolute w-fit h-fit flex flex-row gap-4 p-2 items-center justify-center bg-black/80 rounded-sm left-2 -top-8 border border-white z-10`}
        >
          {[
            {
              title: "Mirror",
              image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
              loader: interactionsLoading?.[index]?.mirror,
              function: () => mirror(item?.id),
            },
            {
              title: "Quote",
              image: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
              loader: false,
              function: () =>
                dispatch(
                  setQuoteBox({
                    actionType: "quote",
                    actionOpen: true,
                    actionQuote: item,
                  })
                ),
            },
          ].map(
            (
              value: {
                title: string;
                image: string;
                loader: boolean;
                function: () => void;
              },
              indexTwo: number
            ) => {
              return (
                <div
                  key={indexTwo}
                  className="relative w-fit h-fit flex cursor-pointer items-center justify-center active:scale-95 hover:opacity-70"
                  onClick={() => {
                    if (disabled) {
                      item?.openActionModules?.[0]?.contract?.address
                        ?.toLowerCase()
                        ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                        ? router.push(
                            `https://cypher.digitalax.xyz/item/coinop/${(
                              item?.metadata as ImageMetadataV3
                            )?.title?.replaceAll(" ", "_")}`
                          )
                        : router.push(`/item/pub/${item?.id}`);
                    } else {
                      !value?.loader && value?.function();
                    }
                  }}
                >
                  {value?.loader ? (
                    <div className="relative w-fit h-fit animate-spin flex items-center justify-center">
                      <AiOutlineLoading size={15} color="white" />
                    </div>
                  ) : (
                    <div
                      className={
                        "relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95"
                      }
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
      <div className="relative w-fit h-fit flex flex-row gap-2 items-end sm:items-center justify-center ml-auto">
        <div
          className="relative flex items-center justify-center rounded-full w-5 h-5 cursor-pointer"
          id="pfp"
        >
          {profilePicture && (
            <Image
              layout="fill"
              src={profilePicture}
              draggable={false}
              className="rounded-full"
              objectFit="cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostBar;
