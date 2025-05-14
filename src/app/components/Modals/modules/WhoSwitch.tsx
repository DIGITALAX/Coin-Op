import { FunctionComponent, JSX, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { Post } from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { WhoSwitchProps } from "../types/modals.types";
import Publication from "./Publication";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const WhoSwitch: FunctionComponent<WhoSwitchProps> = ({
  dict,
  quoters,
  reactors,
  mirrorQuote,
  hasMore,
  hasMoreQuote,
  showMore,
  simpleCollect,
  like,
  mirror,
  openMirrorChoice,
  setOpenMirrorChoice,
  interactionsLoading,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  if (mirrorQuote && quoters?.length > 0) {
    return (
      <div className="relative w-full h-fit flex flex-col overflow-y-scroll max-h-[20rem]">
        <InfiniteScroll
          dataLength={quoters?.length}
          loader={<></>}
          hasMore={hasMoreQuote}
          next={showMore}
          className="w-full h-fit items-start justify-start flex flex-col gap-10"
        >
          {quoters?.map((item: Post, index: number) => {
            return (
              <Publication
                router={router}
                interactionsLoading={interactionsLoading}
                index={index}
                dict={dict}
                item={item}
                data-post-id={item?.id}
                key={index}
                disabled={true}
                like={like}
                mirror={mirror}
                openMirrorChoice={openMirrorChoice}
                setOpenMirrorChoice={setOpenMirrorChoice}
                simpleCollect={simpleCollect}
              />
            );
          })}
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
              context?.reactBox?.type === "Likes"
                ? reactor?.profile
                : context?.reactBox?.type === "Mirrors"
                ? reactor?.by
                : reactor;

            return (
              <div
                key={index}
                className="relative w-full h-14 p-2 flex flex-row items-center justify-start font-mana text-white cursor-pointer"
                id="prerollFaded"
                onClick={() => {
                  context?.setReactBox(undefined);
                  router.push(
                    `https://cypher.digitalax.xyz/autograph/${account?.username?.localName}`
                  );
                }}
              >
                <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                  <div className="relative w-8 h-8 rounded-full border border-white items-center justify-center">
                    <Image
                      src={handleProfilePicture(account?.metadata?.picture)}
                      objectFit="cover"
                      layout="fill"
                      alt="pfp"
                      className="relative w-fit h-fit rounded-full self-center flex"
                      draggable={false}
                    />
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
