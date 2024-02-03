import { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { StickyProps } from "../types/layout.types";
import { AiOutlineLoading } from "react-icons/ai";
import { setFullScreenVideo } from "../../../../redux/reducers/fullScreenVideoSlice";

const Sticky: FunctionComponent<StickyProps> = ({
  router,
  scrollToCheckOut,
  cartItems,
  cartAnim,
  dispatch,
  fullScreenVideo,
  connected,
  chain,
  handleLogout,
  openChainModal,
  openConnectModal,
  handleLensSignIn,
  profile,
  signInLoading,
}): JSX.Element => {
  return (
    <div className="flex w-full h-fit text-white font-mega items-center justify-center md:justify-between md:flex-nowrap flex-wrap md:gap-0 gap-3 order-3 sm:order-1">
      <Link
        className="relative flex justify-start w-fit h-fit items-center whitespace-nowrap break-words cursor-pointer hidden sm:flex"
        href={"/"}
      >
        coin op
      </Link>
      <div className="relative flex w-full h-fit items-center justify-center">
        <div
          className="relative w-fit md:left-12 px-2 py-1.5 h-full items-center justify-center flex flex-row border border-white/40 rounded-full gap-2 cursor-pointer active:scale-95"
          onClick={async () => {
            if (router.asPath.includes("account")) {
              await router.push("/");
            }
            scrollToCheckOut();
          }}
          id={cartAnim ? "cartAnim" : ""}
        >
          <div className="relative text-white font-mana text-xs items-center justify-center">
            {cartItems.reduce(
              (total, cartItem) => total + cartItem.chosenAmount,
              0
            )}{" "}
            items in cart
          </div>
          <div className="relative h-4 w-px bg-white/50"></div>
          <div className="relative w-4 h-3 flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmcDmX2FmwjrhVDLpNii6NdZ4KisoPLMjpRUheB6icqZcV`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div className="relative w-full sm:w-fit h-fit flex flex-col md:flex-row gap-3 items-center justify-between sm:justify-center md:ml-auto">
        <div className="relative w-full sm:w-fit h-fit flex flex-row gap-3 items-center justify-center grow order-2 sm:order-1">
          <Link
            href={"/account"}
            className="relative flex w-12 w-5 h-5 items-center break-words cursor-pointer row-start-1"
            draggable={false}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmSica4PG5nCb89S3As986XcyfDL8bku1MkfoNFb6KyQyK`}
              draggable={false}
            />
          </Link>
          <div
            className="relative flex w-5 h-5 items-center break-words cursor-pointer row-start-1"
            draggable={false}
            onClick={() =>
              dispatch(
                setFullScreenVideo({
                  actionOpen: fullScreenVideo?.open ? false : true,
                  actionTime: fullScreenVideo?.currentTime,
                  actionDuration: fullScreenVideo?.duration,
                  actionIsPlaying: fullScreenVideo?.isPlaying,
                  actionVolume: fullScreenVideo?.volume,
                  actionVolumeOpen: fullScreenVideo?.volumeOpen,
                  actionAllVideos: fullScreenVideo?.allVideos,
                  actionCursor: fullScreenVideo?.cursor,
                  actionIndex: fullScreenVideo?.index,
                })
              )
            }
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmcWAPsmMpNoU87UWxH3L7iDqQXtmDVNxM6H8WYyaRjpHv`}
              draggable={false}
            />
          </div>
          <div
            className={`relative flex items-center justify-center ${
              !signInLoading ? "cursor-pointer" : "animate-spin"
            } ${
              !profile?.id && connected && chain == 137
                ? "w-5 h-5"
                : profile?.id && connected && chain == 137
                ? "w-5 h-4"
                : "w-4 h-4"
            }`}
            onClick={
              !connected
                ? openConnectModal
                : connected && chain !== 137
                ? openChainModal
                : connected && !profile?.id
                ? () => !signInLoading && handleLensSignIn()
                : () => handleLogout()
            }
          >
            {signInLoading ? (
              <AiOutlineLoading color={"white"} size={15} />
            ) : (
              <Image
                layout="fill"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/${
                  !connected
                    ? "QmRZRiYquPa6Ej2zTJCqyEg2yHYSknDsG7cUEpYe2YsnbM"
                    : connected && chain !== 137
                    ? "QmQZ5hsxA4nL7jFvJq5zDuzabpspkywouypwgYBHB98cW3"
                    : !profile?.id
                    ? "Qmd4Y7hmZoNbqfanP1FXMZTKGuKwXMu5W8bUky4q3sPpg2"
                    : "Qmdhwg3H6XJTCQ8sACdywGEPYpWA9uQUYMTsFFEvQGUh33"
                }`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sticky;
