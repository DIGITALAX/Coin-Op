import moment from "moment";
import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import {
  ImageMetadata,
  Post,
  TextOnlyMetadata,
  UnknownPostAction,
} from "@lens-protocol/client";
import { COIN_OP_OPEN_ACTION, INFURA_GATEWAY } from "@/app/lib/constants";
import { PublicationProps } from "../types/modals.types";
import PostSwitch from "./PostSwitch";
import PostQuote from "./PostQuote";
import PostBar from "./PostBar";

const Publication: FunctionComponent<PublicationProps> = ({
  item,
  index,
  mirror,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  simpleCollect,
  disabled,
  router,
  dict,
}): JSX.Element => {
  return (
    <div
      className={`relative rounded-sm h-fit w-full px-1 py-3 sm:py-2 sm:px-2 flex flex-col gap-4 sm:gap-2 border-2 items-center justify-between border-white bg-black`}
      id={item?.id}
    >
      <div className="relative w-full h-fit flex items-center justify-between flex-row">
        <div
          className={`relative w-fit h-fit flex items-center justify-start font-sat text-xxs text-white`}
        >
          <div className={`relative w-fit h-fit flex`}>
            {item?.timestamp && moment(`${item?.timestamp}`).fromNow()}
          </div>
        </div>
        {(item?.__typename === "Repost" ||
          (item?.__typename === "Post" &&
            (item?.quoteOf || item?.commentOn))) && (
          <div
            className={`relative w-fit h-fit row-start-1 items-center justify-end flex flex-row gap-2 font-sat text-xxs`}
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center break-words font-dosis text-white ${
                item?.__typename === "Repost" && "cursor-pointer"
              }`}
              onClick={() =>
                item?.__typename === "Repost" &&
                ((item?.repostOf?.actions?.[0] as UnknownPostAction)?.address
                  ?.toLowerCase()
                  ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                  ? router.push(
                      `https://cypher.digitalax.xyz/item/coinop/${(
                        item?.repostOf?.metadata as ImageMetadata
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : router.push(
                      `https://cypher.digitalax.xyz/item/pub/${item?.repostOf?.id}`
                    ))
              }
            >
              {item?.__typename === "Post" && item?.commentOn
                ? `${dict?.Common?.comO} ${
                    (
                      item?.commentOn?.metadata as TextOnlyMetadata
                    )?.content?.slice(0, 10) + "..."
                  }`
                : item?.__typename === "Repost"
                ? `${dict?.Common?.mirO} ${
                    (
                      item?.repostOf?.metadata as TextOnlyMetadata
                    )?.content?.slice(0, 10) + "..."
                  }`
                : `${dict?.Common?.quoO} ${
                    (
                      item?.quoteOf?.metadata as TextOnlyMetadata
                    )?.content?.slice(0, 10) + "..."
                  }`}
            </div>
            <div className="relative w-3.5 h-3.5 col-start-2 place-self-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  item?.__typename === "Post" && item?.commentOn
                    ? "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n"
                    : item?.__typename === "Repost"
                    ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
                    : "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
                }`}
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>

      <PostSwitch disabled={disabled} item={item} />
      {item?.__typename === "Post" && item?.quoteOf && (
        <PostQuote
          disabled={true}
          quote={item?.quoteOf as Post}
          router={router}
        />
      )}
      <PostBar
        disabled={disabled!}
        index={index}
        item={item as Post}
        dict={dict}
        router={router}
        mirror={mirror}
        like={like}
        interactionsLoading={interactionsLoading}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        simpleCollect={simpleCollect}
      />
    </div>
  );
};

export default Publication;
