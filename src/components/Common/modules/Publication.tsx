import moment from "moment";
import { FunctionComponent } from "react";
import {
  Comment,
  ImageMetadataV3,
  Mirror,
  Post,
  Quote,
  TextOnlyMetadataV3,
} from "../types/generated";
import { COIN_OP_OPEN_ACTION, INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import PostSwitch from "./PostSwitch";
import PostQuote from "./PostQuote";
import { PublicationProps } from "../types/common.types";
import PostBar from "./PostBar";

const Publication: FunctionComponent<PublicationProps> = ({
  item,
  index,
  dispatch,
  mirror,
  like,
  interactionsLoading,
  openMirrorChoice,
  setOpenMirrorChoice,
  simpleCollect,
  disabled,
  router,
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
            {item?.createdAt && moment(`${item?.createdAt}`).fromNow()}
          </div>
        </div>
        {(item?.__typename === "Comment" ||
          item?.__typename === "Quote" ||
          item?.__typename === "Mirror") && (
          <div
            className={`relative w-fit h-fit row-start-1 items-center justify-end flex flex-row gap-2 font-sat text-xxs`}
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center break-words font-dosis text-white ${
                item?.__typename === "Mirror" && "cursor-pointer"
              }`}
              onClick={() =>
                item?.__typename === "Mirror" &&
                (item?.mirrorOn?.openActionModules?.[0]?.contract?.address
                  ?.toLowerCase()
                  ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
                  ? router.push(
                      `https://cypher.digitalax.xyz/item/coinop/${(
                        item?.mirrorOn?.metadata as ImageMetadataV3
                      )?.title?.replaceAll(" ", "_")}`
                    )
                  : router.push(
                      `https://cypher.digitalax.xyz/item/pub/${item?.mirrorOn?.id}`
                    ))
              }
            >
              {item?.__typename === "Comment"
                ? `Comment on ${
                    (
                      (item as Comment)?.commentOn
                        ?.metadata as TextOnlyMetadataV3
                    )?.content?.slice(0, 10) + "..."
                  }`
                : item?.__typename === "Mirror"
                ? `Mirror of ${
                    (
                      (item as Mirror)?.mirrorOn?.metadata as TextOnlyMetadataV3
                    )?.content?.slice(0, 10) + "..."
                  }`
                : `Quote on ${
                    (
                      (item as Quote)?.quoteOn?.metadata as TextOnlyMetadataV3
                    )?.content?.slice(0, 10) + "..."
                  }`}
            </div>
            <div className="relative w-3.5 h-3.5 col-start-2 place-self-center">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${
                  item?.__typename === "Comment"
                    ? "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n"
                    : item?.__typename === "Mirror"
                    ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
                    : "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
                }`}
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>

      <PostSwitch disabled={disabled} item={item} dispatch={dispatch} />
      {item?.__typename === "Quote" && (
        <PostQuote
          disabled={true}
          quote={item?.quoteOn}
          dispatch={dispatch}
          router={router}
        />
      )}
      <PostBar
        disabled={disabled!}
        index={index}
        item={item as Post}
        dispatch={dispatch}
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
