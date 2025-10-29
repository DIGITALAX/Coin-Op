import { ChangeEvent, FunctionComponent, JSX, useContext } from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import {
  PiArrowFatLinesRightFill,
  PiArrowFatLinesLeftFill,
} from "react-icons/pi";
import { ModalContext, SynthContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useAccount } from "wagmi";
import { usePathname, useRouter } from "next/navigation";
import useLens from "../hooks/useLens";
import { useModal } from "connectkit";
import useRollSearch from "../hooks/useRollSearch";
import SearchBox from "./SearchBox";
import { Preroll } from "../../Prerolls/types/prerolls.types";

const Sticky: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const path = usePathname();
  const router = useRouter();
  const { openSwitchNetworks, openOnboarding } = useModal();
  const { isConnected, chainId, address } = useAccount();
  const { lensCargando, handleConectarse, salir, scrollToCheckOut, cartAnim } =
    useLens(isConnected, address, dict);
  const context = useContext(ModalContext);
  const synthContext = useContext(SynthContext);
  const {
    handleRollSearch,
    prompt,
    setPrompt,
    handleAddToCart,
    searchLoading,
  } = useRollSearch(dict);
  return (
    <div className="relative w-full h-fit flex flex-col gap-3 items-center pb-2">
      <div className="relative w-full h-fit flex flex-col gap-3 items-center">
        <div className="absolute top-0 left-0 flex w-full h-full">
          <Image
            draggable={false}
            layout="fill"
            objectFit="cover"
            alt="Runway"
            src={`${INFURA_GATEWAY}/ipfs/QmaYAY2o2eT2GCKXswVR4dxZSvGvrD71Ra3Pq2CxZKUfDg`}
          />
        </div>
        <Link
          className="relative flex pt-2 pl-2 justify-start w-full text-left h-fi items-center whitespace-nowrap text-white break-words font-count cursor-pointer flex text-6xl"
          href={"/"}
        >
          coin op
        </Link>
        <div className="relative w-full sm:w-3/4 flex flex-col items-center justify-start h-fit gap-4 sm:pb-28">
          <div className="relative w-3/4 h-fit flex">
            <input
              className="bg-black font-mega text-white text-xs w-full flex py-1 px-4 h-12 border border-agua"
              style={{ transform: "skewX(-15deg)" }}
              placeholder={dict?.Common?.graff}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPrompt(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  handleRollSearch();
                }
              }}
              value={prompt || ""}
            />
            <div
              className={`absolute right-4 z-10 h-full items-center justify-center w-fit flex ${
                searchLoading ? "animate-spin" : "cursor-pointer"
              }`}
              onClick={() => handleRollSearch()}
            >
              {searchLoading ? (
                <AiOutlineLoading color="#66C89B" size={15} />
              ) : (
                <div className="relative w-12 h-full flex hover:opacity-70">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmPudmTzMo9DjndyhLTZXmKweYLX4prYYKQZLjcQ4iXLWx`}
                    alt="search"
                    draggable={false}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              )}
            </div>
          </div>
          <div
            className={`relative flex flex-col w-full h-48 justify-start items-start overflow-y-scroll flex`}
          >
            {Number(synthContext?.rollSearch?.length) > 0 && (
              <div className="relative inline-flex flex-wrap gap-6 pt-6 justify-start items-center">
                {synthContext?.rollSearch?.map(
                  (roll: Preroll, index: number) => {
                    return (
                      <SearchBox
                        handleAddToCart={handleAddToCart}
                        dict={dict}
                        key={index}
                        promptSearch={roll}
                      />
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-black flex w-full h-fit text-white font-mega items-center justify-center md:justify-between md:flex-nowrap flex-wrap md:gap-0 gap-3 px-2 relative">
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
        <div className="relative w-fit h-fit flex flex-col md:flex-row gap-3 items-center justify-between sm:justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
          <div className="relative w-full sm:w-fit h-fit flex flex-row gap-3 items-center justify-center grow">
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
                !context?.lensConectado?.profile &&
                isConnected &&
                chainId == 37111
                  ? "w-5 h-5"
                  : context?.lensConectado?.profile &&
                    isConnected &&
                    chainId == 37111
                  ? "w-5 h-4"
                  : "w-4 h-4"
              }`}
              onClick={() =>
                !isConnected
                  ? chainId !== 37111
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
                      : isConnected && chainId != 37111
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
        <div className="relative flex w-fit h-fit items-center justify-center">
          <div
            className="relative w-fit h-full items-center justify-center flex flex-row gap-2 cursor-pointer active:scale-95"
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
            <div className="relative w-4 h-3 flex items-center justify-center">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmcDmX2FmwjrhVDLpNii6NdZ4KisoPLMjpRUheB6icqZcV`}
                layout="fill"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sticky;
