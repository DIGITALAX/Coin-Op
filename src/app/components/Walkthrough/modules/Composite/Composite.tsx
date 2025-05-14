import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { usePathname } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import {
  PinterestShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
} from "react-share";
import { BiLogoTwitter } from "react-icons/bi";
import { FaPinterestP, FaTelegramPlane } from "react-icons/fa";
import { IoLogoReddit, IoLogoTumblr } from "react-icons/io";
import useLens from "@/app/components/Common/hooks/useLens";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { ModalContext, ScrollContext } from "@/app/providers";
import ModelSelect from "./ModelSelect";
import useComposite from "../../hooks/useComposite";

const Composite: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const path = usePathname();
  const context = useContext(ModalContext);
  const scrollContext = useContext(ScrollContext);
  const { openSwitchNetworks, openOnboarding } = useModal();
  const { isConnected, chainId, address } = useAccount();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const { setShareSet, shareSet, models } = useComposite();

  return (
    <div className="relative w-full h-fit flex flex-col">
      <div
        className="relative w-full h-100 flex flex-col gap-2"
        ref={scrollContext?.compositeRef}
      >
        <div className="absolute w-full h-full hidden preG:flex">
          <Image
            alt="copy"
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
            draggable={false}
          />
        </div>
        <div className="relative w-full flex h-3/4 preG:px-7 pt-4 order-1">
          <div className="relative w-full h-full object-cover border border-azul rounded-md">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmWX2sNq9YWbzFBzTqKNW9cZBcy4xNfCw1wfwxZJMH3mNf`}
              layout="fill"
              objectFit="cover"
              draggable={false}
            />
            <ModelSelect models={models} dict={dict} />
          </div>
        </div>
        <div className="relative preG:absolute bottom-6 right-2 sm:right-9 w-full preG:pt-0 pt-10 preG:w-fit h-fit flex flex-col md:flex-row gap-3 text-white items-center justify-center text-center preG:order-2 order-3">
          <div className="relative w-9 h-3 items-center justify-center flex flex-row">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmZ4XuwsWcHpCXq56LNmAuvVck7D7WLmXWLcLJmGm1rjC4`}
              layout="fill"
              draggable={false}
            />
          </div>
          <div
            className={`relative w-fit h-fit items-center justify-center text-center flex font-mega uppercase" ${
              path?.includes("/es/")
                ? "text-xs md:text-sm lg:text-xl"
                : "text-xs md:text-sm lg:text-xl xl:text-base synth:text-2xl"
            }`}
          >
            {dict?.Common?.friends}
          </div>
          <div className="relative w-fit h-fit items-center justify-center flex flex-row gap-2 font-herm text-lg">
            <div
              className={`relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95 ${
                lensCargando && "animate-spin"
              }`}
              onClick={() =>
                !context?.apiKey
                  ? context?.setOpenAPIKey(true)
                  : !isConnected
                  ? chainId !== 232
                    ? openSwitchNetworks?.()
                    : openOnboarding?.()
                  : isConnected && !context?.lensConectado?.profile
                  ? !lensCargando && handleConectarse()
                  : {}
              }
            >
              {lensCargando ? (
                <AiOutlineLoading size={15} color="#FBDB86" />
              ) : (
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmPmpjnih3LZGeVfUmB2sFVTvvz8fwGkGL6YEaRYrJaXPF`}
                  layout="fill"
                  draggable={false}
                />
              )}
            </div>
            {shareSet && (
              <div className="absolute -top-8 w-fit h-fit py-1 flex flex-row gap-1 px-2 rounded-md z-1 bg-black border border-ama">
                <PinterestShareButton
                  url={`${INFURA_GATEWAY}/ipfs`}
                  title={`Coin Op Manufactory`}
                  media={`${INFURA_GATEWAY}/ipfs`}
                  onClick={() => {
                    !context?.apiKey && context?.setOpenAPIKey(true);
                    setShareSet(false);
                  }}
                >
                  <FaPinterestP size={15} color={"#FBDB86"} />
                </PinterestShareButton>
                <TwitterShareButton
                  url={`${INFURA_GATEWAY}/ipfs`}
                  title={`Coin Op Manufactory`}
                  onClick={() => {
                    !context?.apiKey && context?.setOpenAPIKey(true);
                    setShareSet(false);
                  }}
                >
                  <BiLogoTwitter size={15} color={"#FBDB86"} />
                </TwitterShareButton>
                <RedditShareButton
                  url={`${INFURA_GATEWAY}/ipfs`}
                  title={`Coin Op Manufactory`}
                  onClick={() => {
                    !context?.apiKey && context?.setOpenAPIKey(true);
                    setShareSet(false);
                  }}
                >
                  <IoLogoReddit size={15} color={"#FBDB86"} />
                </RedditShareButton>
                <TelegramShareButton
                  url={`${INFURA_GATEWAY}/ipfs`}
                  title={`Coin Op Manufactory`}
                  onClick={() => {
                    !context?.apiKey && context?.setOpenAPIKey(true);
                    setShareSet(false);
                  }}
                >
                  <FaTelegramPlane size={15} color={"#FBDB86"} />
                </TelegramShareButton>
                <TumblrShareButton
                  url={`${INFURA_GATEWAY}/ipfs`}
                  title={`Coin Op Manufactory`}
                  onClick={() => {
                    !context?.apiKey && context?.setOpenAPIKey(true);
                    setShareSet(false);
                  }}
                >
                  <IoLogoTumblr size={15} color={"#FBDB86"} />
                </TumblrShareButton>
              </div>
            )}
            <div
              className="relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() =>
                !context?.apiKey
                  ? context?.setOpenAPIKey(true)
                  : setShareSet(!shareSet)
              }
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmVCSuJ99xXwXFZtNm8b77GJCvVWJCSAUxZtFppuSE6i7s`}
                layout="fill"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div
          className={`relative w-full preG:w-fit flex justify-center preG:absolute text-white text-sm sm:text-xl tablet:text-3xl uppercase preG:bottom-4 preG:order-3 order-2 preG:pt-0 pt-3 ${
            path?.includes("/en/") ? "font-mana" : "font-bit"
          }`}
          draggable={false}
        >
          {dict?.Common?.edit}
        </div>
      </div>
    </div>
  );
};

export default Composite;
