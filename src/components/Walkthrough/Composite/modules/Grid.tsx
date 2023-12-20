import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps } from "../types/composite.types";
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
import ModelSelect from "./ModelSelect";
import { AiOutlineLoading } from "react-icons/ai";
import { setApiAdd } from "../../../../../redux/reducers/apiAddSlice";

const Grid: FunctionComponent<GridProps> = ({
  dispatch,
  shareSet,
  setShareSet,
  openConnectModal,
  handleLensSignIn,
  profile,
  address,
  models,
  signInLoading,
  compositeRef,
  openChainModal,
  chain,
  apiKey,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-100 flex flex-col gap-2"
      ref={compositeRef}
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
          <ModelSelect models={models} />
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
        <div className="relative w-fit h-fit items-center justify-center text-center flex font-mega text-xs md:text-sm lg:text-xl xl:text-base synth:text-2xl uppercase">
          share with friends
        </div>
        <div className="relative w-fit h-fit items-center justify-center flex flex-row gap-2 font-herm text-lg">
          <div
            className={`relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95 ${
              signInLoading && "animate-spin"
            }`}
            onClick={
              !apiKey
                ? () =>
                    dispatch(
                      setApiAdd({
                        actionKey: undefined,
                        actionOpen: true,
                      })
                    )
                : !address
                ? openConnectModal
                : chain !== 137
                ? openChainModal
                : () => (address && !profile ? handleLensSignIn() : {})
            }
          >
            {signInLoading ? (
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
                  !apiKey &&
                    dispatch(
                      setApiAdd({
                        actionKey: undefined,
                        actionOpen: true,
                      })
                    );
                  setShareSet(false);
                }}
              >
                <FaPinterestP size={15} color={"#FBDB86"} />
              </PinterestShareButton>
              <TwitterShareButton
                url={`${INFURA_GATEWAY}/ipfs`}
                title={`Coin Op Manufactory`}
                onClick={() => {
                  !apiKey &&
                    dispatch(
                      setApiAdd({
                        actionKey: undefined,
                        actionOpen: true,
                      })
                    );
                  setShareSet(false);
                }}
              >
                <BiLogoTwitter size={15} color={"#FBDB86"} />
              </TwitterShareButton>
              <RedditShareButton
                url={`${INFURA_GATEWAY}/ipfs`}
                title={`Coin Op Manufactory`}
                onClick={() => {
                  !apiKey &&
                    dispatch(
                      setApiAdd({
                        actionKey: undefined,
                        actionOpen: true,
                      })
                    );
                  setShareSet(false);
                }}
              >
                <IoLogoReddit size={15} color={"#FBDB86"} />
              </RedditShareButton>
              <TelegramShareButton
                url={`${INFURA_GATEWAY}/ipfs`}
                title={`Coin Op Manufactory`}
                onClick={() => {
                  !apiKey &&
                    dispatch(
                      setApiAdd({
                        actionKey: undefined,
                        actionOpen: true,
                      })
                    );
                  setShareSet(false);
                }}
              >
                <FaTelegramPlane size={15} color={"#FBDB86"} />
              </TelegramShareButton>
              <TumblrShareButton
                url={`${INFURA_GATEWAY}/ipfs`}
                title={`Coin Op Manufactory`}
                onClick={() => {
                  !apiKey &&
                    dispatch(
                      setApiAdd({
                        actionKey: undefined,
                        actionOpen: true,
                      })
                    );
                  setShareSet(false);
                }}
              >
                <IoLogoTumblr size={15} color={"#FBDB86"} />
              </TumblrShareButton>
            </div>
          )}
          <div
            className="relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => {
              !apiKey &&
                dispatch(
                  setApiAdd({
                    actionKey: undefined,
                    actionOpen: true,
                  })
                );
              apiKey && setShareSet(!shareSet);
            }}
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
        className="relative w-full preG:w-fit flex justify-center preG:absolute text-white font-mana text-sm sm:text-xl tablet:text-3xl uppercase preG:bottom-4 preG:order-3 order-2 preG:pt-0 pt-3"
        draggable={false}
      >
        edit for composite
      </div>
    </div>
  );
};

export default Grid;
