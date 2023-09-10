import { FunctionComponent } from "react";
import { setLogin } from "../../../../redux/reducers/loginSlice";
import Link from "next/link";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { setVideoPlayer } from "../../../../redux/reducers/videoPlayerSlice";
import { StickyProps } from "../types/layout.types";

const Sticky: FunctionComponent<StickyProps> = ({
  router,
  scrollToCheckOut,
  cartItems,
  cartAnim,
  dispatch,
  videoPlayer,
  connected,
  chain,
  connectedPKP,
  openAccountModal,
  openChainModal,
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
            if (
              router.asPath.includes("account") ||
              router.asPath.includes("pregame") ||
              router.asPath.includes("quests")
            ) {
              await router.push("/");
            }
            scrollToCheckOut();
          }}
          id={cartAnim ? "cartAnim" : ""}
        >
          <div className="relative text-white font-mana text-xs items-center justify-center">
            {cartItems.reduce((total, cartItem) => total + cartItem.amount, 0)}{" "}
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
      <div className="relative w-auto h-fit items-center justify-center flex sm:hidden">
        <div
          className="relative w-20 h-7 px-1 text-white flex items-center justify-center border border-white cursor-pointer row-start-2 md:row-start-1"
          onClick={
            !connected && !connectedPKP
              ? () =>
                  dispatch(
                    setLogin({
                      actionOpen: true,
                      actionHighlight: undefined,
                    })
                  )
              : connected && chain !== 137
              ? openChainModal
              : connected
              ? openAccountModal
              : () =>
                  dispatch(
                    setLogin({
                      actionOpen: true,
                      actionHighlight: undefined,
                    })
                  )
          }
        >
          <div className={`relative text-xxs font-mana`}>
            {!connected && !connectedPKP
              ? "Connect"
              : connected && chain !== 137
              ? "Switch"
              : "Connected"}
          </div>
        </div>
      </div>
      <div className="relative w-full sm:w-fit h-fit flex flex-row gap-3 items-center justify-between sm:justify-center md:ml-auto">
        <div className="relative w-full sm:w-fit h-fit flex flex-row gap-3 items-center justify-center grow">
          <Link
            href={"/account"}
            className="relative flex w-12 sm:w-5 h-12 sm:h-5 items-center break-words cursor-pointer row-start-1"
            draggable={false}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmSica4PG5nCb89S3As986XcyfDL8bku1MkfoNFb6KyQyK`}
              draggable={false}
            />
          </Link>
          <Link
            href={"/quests"}
            className="relative flex w-16 sm:w-8 h-12 sm:h-5 items-center break-words cursor-pointer row-start-1"
            draggable={false}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmUGDXPtu1K5FqKJECQSgekui6KUH3zmfwGrB23q6jdS5g`}
              draggable={false}
            />
          </Link>
          <div
            className="relative flex w-12 sm:w-5 h-12 sm:h-5 items-center break-words cursor-pointer row-start-1"
            draggable={false}
            onClick={() => dispatch(setVideoPlayer(!videoPlayer))}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmcWAPsmMpNoU87UWxH3L7iDqQXtmDVNxM6H8WYyaRjpHv`}
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-auto h-fit items-center justify-center sm:flex hidden">
          <div
            className="relative w-20 h-7 px-1 text-white flex items-center justify-center border border-white cursor-pointer row-start-2 md:row-start-1"
            onClick={
              !connected && !connectedPKP
                ? () =>
                    dispatch(
                      setLogin({
                        actionOpen: true,
                        actionHighlight: undefined,
                      })
                    )
                : connected && chain !== 137
                ? openChainModal
                : connected
                ? openAccountModal
                : () =>
                    dispatch(
                      setLogin({
                        actionOpen: true,
                        actionHighlight: undefined,
                      })
                    )
            }
          >
            <div className={`relative text-xxs font-mana`}>
              {!connected && !connectedPKP
                ? "Connect"
                : connected && chain !== 137
                ? "Switch"
                : "Connected"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sticky;
