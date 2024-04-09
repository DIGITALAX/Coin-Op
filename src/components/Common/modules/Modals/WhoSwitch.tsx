import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import createProfilePicture from "../../../../../lib/lens/helpers/createProfilePicture";
import { WhoSwitchProps } from "../../types/common.types";
import { Comment, Quote } from "../../types/generated";
import Publication from "../Publication";
import { setReactBox } from "../../../../../redux/reducers/reactBoxSlice";

const WhoSwitch: FunctionComponent<WhoSwitchProps> = ({
  type,
  router,
  reactors,
  quoters,
  showMore,
  hasMoreQuote,
  hasMore,
  mirrorQuote,
  dispatch,
  like,
  mirror,
  t,
  simpleCollect,
  openMirrorChoice,
  setOpenMirrorChoice,
  interactionsLoading,
}): JSX.Element => {
  if (
    (mirrorQuote && quoters?.length > 0) ||
    (type === "Comments" && reactors?.length > 0 && !mirrorQuote)
  ) {
    return (
      <div className="relative w-full h-fit flex flex-col overflow-y-scroll max-h-[20rem]">
        <InfiniteScroll
          dataLength={type === "Comments" ? reactors?.length : quoters?.length}
          loader={<></>}
          hasMore={type === "Comments" ? hasMore : hasMoreQuote}
          next={showMore}
          className="w-full h-fit items-start justify-start flex flex-col gap-10"
        >
          {(type === "Comments" ? reactors : quoters)?.map(
            (item: Quote | Comment, index: number) => {
              return (
                <Publication
                  router={router}
                  t={t}
                  interactionsLoading={interactionsLoading}
                  index={index}
                  item={item}
                  dispatch={dispatch}
                  data-post-id={item?.id}
                  key={index}
                  disabled={type === "Comments" ? false : true}
                  like={like}
                  mirror={mirror}
                  openMirrorChoice={openMirrorChoice}
                  setOpenMirrorChoice={setOpenMirrorChoice}
                  simpleCollect={simpleCollect}
                />
              );
            }
          )}
        </InfiniteScroll>
      </div>
    );
  } else {
    return reactors?.length > 0 && !mirrorQuote ? (
      <div className="relative w-full h-40 flex flex-col overflow-y-scroll">
        <InfiniteScroll
          hasMore={!mirrorQuote ? hasMore : hasMoreQuote}
          dataLength={!mirrorQuote ? reactors?.length : quoters?.length}
          next={showMore}
          loader={""}
          height={"10rem"}
          className="relative w-full h-40 flex flex-col px-4 gap-2 overflow-y-scroll"
        >
          {reactors?.map((reactor: any, index: number) => {
            const account =
              type === "Likes"
                ? reactor?.profile
                : type === "Mirrors"
                ? reactor?.by
                : reactor;

            const profileImage = createProfilePicture(
              account?.metadata?.picture
            );

            return (
              <div
                key={index}
                className="relative w-full h-14 p-2 flex flex-row items-center justify-start font-mana text-white cursor-pointer"
                id="prerollFaded"
                onClick={() => {
                  setReactBox({
                    actionOpen: false,
                  });
                  router.push(
                    `https://cypher.digitalax.xyz/autograph/${
                      account?.handle?.suggestedFormatted?.localName?.split(
                        "@"
                      )[1]
                    }`
                  );
                }}
              >
                <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                  <div className="relative w-8 h-8 rounded-full border border-white items-center justify-center">
                    {profileImage && (
                      <Image
                        src={profileImage}
                        objectFit="cover"
                        layout="fill"
                        alt="pfp"
                        className="relative w-fit h-fit rounded-full self-center flex"
                        draggable={false}
                      />
                    )}
                  </div>
                  <div
                    id="handle"
                    className="relative w-fit h-fit justify-center items-center flex top-px text-sm"
                  >
                    {account?.handle?.suggestedFormatted?.localName}
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    ) : (
      <></>
    );
  }
};

export default WhoSwitch;
