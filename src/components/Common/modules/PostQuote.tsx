import { FunctionComponent } from "react";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { COIN_OP_OPEN_ACTION } from "../../../../lib/constants";
import { ImageMetadataV3 } from "../types/generated";
import Image from "next/legacy/image";
import moment from "moment";
import PostSwitch from "./PostSwitch";
import { PostQuoteProps } from "../types/common.types";

const PostQuote: FunctionComponent<PostQuoteProps> = ({
  quote,
  dispatch,
  router,
  pink,
  disabled,
}): JSX.Element => {
  const profilePicture = createProfilePicture(quote?.by?.metadata?.picture);
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
            (quote?.openActionModules?.[0]?.contract?.address
              ?.toLowerCase()
              ?.includes(COIN_OP_OPEN_ACTION?.toLowerCase())
              ? router.push(
                  `https://cypher.digitalax.xyz/item/coinop/${(
                    quote?.metadata as ImageMetadataV3
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
            <div
              className={`relative w-fit h-fit text-xs flex items-center justify-center text-white font-sat top-px`}
            >
              {quote?.by?.handle?.suggestedFormatted?.localName
                ? quote?.by?.handle?.suggestedFormatted?.localName.length > 25
                  ? quote?.by?.handle?.suggestedFormatted?.localName.substring(
                      0,
                      20
                    ) + "..."
                  : quote?.by?.handle?.suggestedFormatted?.localName
                : ""}
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div
              className={`relative w-fit h-fit text-white font-sat items-center justify-center flex text-xs ml-auto top-px`}
            >
              {quote?.createdAt && moment(`${quote?.createdAt}`).fromNow()}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-center">
          <PostSwitch item={quote} dispatch={dispatch} disabled={disabled} />
        </div>
      </div>
    </div>
  );
};

export default PostQuote;
