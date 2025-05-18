import { FunctionComponent, JSX, useContext } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import {
  PiArrowFatLinesRightFill,
  PiArrowFatLinesLeftFill,
} from "react-icons/pi";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useAccount } from "wagmi";
import { usePathname, useRouter } from "next/navigation";
import useLens from "../hooks/useLens";
import { useModal } from "connectkit";

const Sticky: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const path = usePathname();
  const router = useRouter();
  const { openSwitchNetworks, openOnboarding } = useModal();
  const { isConnected, chainId, address } = useAccount();
  const { lensCargando, handleConectarse, salir, scrollToCheckOut, cartAnim } =
    useLens(isConnected, address, dict);
  const context = useContext(ModalContext);
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
          onClick={() => {
            if (path.includes("account")) {
              router.prefetch("/");
              router.push("/");
            }
            scrollToCheckOut();
          }}
          id={cartAnim ? "cartAnim" : ""}
        >
          <div
            className={`relative text-white text-xs items-center justify-center ${
              path?.includes("/es/") ? "font-bit" : "font-mana"
            }`}
          >
            {context?.cartItems.reduce(
              (total, cartItem) => total + cartItem.chosenAmount,
              0
            )}{" "}
            {dict?.Common?.cart}
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
          <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-3">
            <div className="relative w-fit h-fit flex items-center justify-center text-white flex-col text-center font-gen uppercase">
              <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2">
                <div
                  className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-sewingHS"
                  onClick={() => {
                    router.push(
                      path.includes("/en/")
                        ? path.replace("/en/", "/es/")
                        : path.replace("/es/", "/en/")
                    );
                  }}
                >
                  <PiArrowFatLinesLeftFill size={15} />
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center">
                  <div className="relative w-5 h-7 flex items-center justify-center">
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/${
                        path?.includes("/es/")
                          ? "QmY43U5RovVkoGrkLiFyA2VPMnGxf5e3NgYZ95u9aNJdem"
                          : "QmXdyvCYjZ7FkPjgFX5BPi98WTpPdJT5FHhzhtbyzkJuNs"
                      }`}
                      draggable={false}
                    />
                  </div>
                </div>
                <div
                  className="relative flex items-center justify-center w-fit h-fit active:scale-95 cursor-pointer"
                  onClick={() => {
                    router.push(
                      path.includes("/en/")
                        ? path.replace("/en/", "/es/")
                        : path.replace("/es/", "/en/")
                    );
                  }}
                >
                  <PiArrowFatLinesRightFill size={15} />
                </div>
              </div>
            </div>
          </div>
          <Link
            href={"/account"}
            className="relative flex w-5 h-5 items-center break-words cursor-pointer row-start-1"
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
              context?.setFullScreenVideo({
                ...context?.fullScreenVideo,
                open: !context?.fullScreenVideo?.open ? true : false,
              })
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
              !lensCargando ? "cursor-pointer" : "animate-spin"
            } ${
              !context?.lensConectado?.profile && isConnected && chainId == 232
                ? "w-5 h-5"
                : context?.lensConectado?.profile &&
                  isConnected &&
                  chainId == 232
                ? "w-5 h-4"
                : "w-4 h-4"
            }`}
            onClick={() =>
              !isConnected
                ? chainId !== 232
                  ? openSwitchNetworks?.()
                  : openOnboarding?.()
                : isConnected && !context?.lensConectado?.profile
                ? !lensCargando && handleConectarse()
                : salir()
            }
          >
            {lensCargando ? (
              <AiOutlineLoading color={"white"} size={15} />
            ) : (
              <Image
                layout="fill"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/${
                  !isConnected
                    ? "QmRZRiYquPa6Ej2zTJCqyEg2yHYSknDsG7cUEpYe2YsnbM"
                    : isConnected && chainId != 232
                    ? "QmQZ5hsxA4nL7jFvJq5zDuzabpspkywouypwgYBHB98cW3"
                    : !context?.lensConectado?.profile
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
