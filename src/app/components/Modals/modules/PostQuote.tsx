import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import moment from "moment";
import PostSwitch from "./PostSwitch";
import { COIN_OP_OPEN_ACTION, INFURA_GATEWAY } from "@/app/lib/constants";
import { ImageMetadata } from "@lens-protocol/client";
import { PostQuoteProps } from "../types/modals.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const PostQuote: FunctionComponent<PostQuoteProps> = ({
  quote,
  router,
  pink,
  disabled,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-60 overflow-y-hidden sm:px-5 py-1 flex items-start justify-center"
      id="fadedQuote"
    >
      <div
        className={`relative w-full h-full p-2 flex items-center justify-start flex-col from-offBlack cursor-pointer to-black bg-gradient-to-r rounded-md gap-5`}
        onClick={(e) => {
          e.stopPropagation();
          !pink &&
            (quote?.actions?.[0]?.address
              ?.toLowerCase()
              ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
              ? router.push(
                  `https://cypher.digitalax.xyz/item/coinop/${(
                    quote?.metadata as ImageMetadata
                  )?.title?.replaceAll(" ", "_")}`
                )
              : router.push(
                  `https://cypher.digitalax.xyz/item/pub/${quote?.id}`
                ));
        }}
      >
        <div className="relative w-full h-fit flex flex-row items-center justify-center gap-2 px-1">
          <div className="relative w-fit h-fit flex items-center justify-center gap-1 mr-auto">
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div className="relative flex items-center justify-center rounded-full w-5 h-5">
                <Image
                  layout="fill"
                  src={handleProfilePicture(quote?.author?.metadata?.picture)}
                  draggable={false}
                  className="rounded-full"
                  objectFit="cover"
                />
              </div>
            </div>
            <div
              className={`relative w-fit h-fit text-xs flex items-center justify-center text-white font-sat top-px`}
            >
              {quote?.author?.username?.localName
                ? quote?.author?.username?.localName?.length > 25
                  ? quote?.author?.username?.localName?.substring(0, 20) + "..."
                  : quote?.author?.username?.localName
                : ""}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div
              className={`relative w-fit h-fit text-white font-sat items-center justify-center flex text-xs ml-auto top-px`}
            >
              {quote?.timestamp && moment(`${quote?.timestamp}`).fromNow()}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-center">
          <PostSwitch item={quote} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default PostQuote;
