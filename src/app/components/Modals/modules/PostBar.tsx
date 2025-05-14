import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import numeral from "numeral";
import { COIN_OP_OPEN_ACTION, INFURA_GATEWAY } from "@/app/lib/constants";
import { ImageMetadata } from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";
import { PostBarProps } from "../types/modals.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const PostBar: FunctionComponent<PostBarProps> = ({
  index,
  like,
  mirror,
  simpleCollect,
  interactionsLoading,
  item,
  openMirrorChoice,
  setOpenMirrorChoice,
  router,
  disabled,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full justify-between flex flex-col sm:flex-row items-between sm:items-center gap-2 bg-mist p-1">
      <div className="relative w-fit h-fit flex flex-row items-start sm:items-center gap-2 justify-center">
        {[
          {
            image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            title: dict?.Common?.mirs,
            function: () =>
              setOpenMirrorChoice!((prev) => {
                const choices = [...prev!];
                choices[index] = !choices[index];
                return choices;
              }),
            stat: item?.stats?.reposts || 0 || item?.stats?.quotes || 0,
            responded:
              item?.operations?.hasReposted?.optimistic! ||
              item?.operations?.hasQuoted?.optimistic!,
            loader: false,
          },
          {
            image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
            title: dict?.Common?.like,
            function: () => like(item?.id, item?.operations?.hasUpvoted!),
            stat: item?.stats?.upvotes || 0,
            responded: item?.operations?.hasUpvoted!,
            loader: interactionsLoading?.[index]?.like,
          },
          {
            image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
            title: dict?.Common?.comm,
            function: () =>
              context?.setQuoteBox({
                type: "comment",
                quote: item,
              }),
            stat: item?.stats?.comments || 0,
            responded: item?.operations?.hasCommented?.optimistic!,
            loader: false,
          },
          {
            image: "QmZ4v5pzdnCBeyKnS9VrjZiEAbUpAVy8ECArNcpxBt6Tw4",
            title: dict?.Common?.colls,
            function: () =>
              item?.actions?.[0]?.__typename &&
              simpleCollect(item?.id, item?.actions?.[0]?.__typename!),
            stat: item?.stats?.collects || 0,
            responded: item?.operations?.hasSimpleCollected!,
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
                    value?.title == dict?.Common?.colls &&
                    !item?.actions?.[0]?.__typename
                      ? "opacity-50"
                      : "active:scale-95 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (disabled) {
                      item?.actions?.[0]?.address
                        ?.toLowerCase()
                        ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                        ? router.push(
                            `https://cypher.digitalax.xyz/item/coinop/${(
                              item?.metadata as ImageMetadata
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
                      item?.actions?.[0]?.address
                        ?.toLowerCase()
                        ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                        ? router.push(
                            `https://cypher.digitalax.xyz/item/coinop/${(
                              item?.metadata as ImageMetadata
                            )?.title?.replaceAll(" ", "_")}`
                          )
                        : router.push(
                            `https://cypher.digitalax.xyz/item/pub/${item?.id}`
                          );
                    } else {
                      context?.setReactBox({
                        id: item?.id,
                        type: value?.title,
                      });
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
              title: dict?.Common?.mirror,
              image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
              loader: interactionsLoading?.[index]?.mirror,
              function: () => mirror(item?.id),
            },
            {
              title: dict?.Common?.quote,
              image: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
              loader: false,
              function: () =>
                context?.setQuoteBox({
                  type: "quote",
                  quote: item,
                }),
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
                      item?.actions?.[0]?.address
                        ?.toLowerCase()
                        ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                        ? router.push(
                            `https://cypher.digitalax.xyz/item/coinop/${(
                              item?.metadata as ImageMetadata
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
          <Image
            layout="fill"
            src={handleProfilePicture(item?.author?.metadata?.picture)}
            draggable={false}
            className="rounded-full"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
};

export default PostBar;
