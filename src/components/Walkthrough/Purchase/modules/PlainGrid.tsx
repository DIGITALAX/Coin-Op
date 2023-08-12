import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../../lib/constants";
import { GridProps } from "../types/synth.types";
import ShippingInfo from "./ShippingInfo";
import Crypto from "./Crypto";

const PlainGrid: FunctionComponent<GridProps> = ({
  dispatch,
  scrollRef,
  cartItems,
  signInLoading,
  address,
  openConnectModal,
  fulfillmentDetails,
  connectedPKP,
  chain,
  openChainModal
}): JSX.Element => {
  return (
    <div className="relative w-full h-100 flex flex-col gap-2" ref={scrollRef}>
      <div className="absolute w-full h-full hidden preG:flex">
        <Image
          alt="copy"
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
          draggable={false}
        />
      </div>
      <div className="relative w-full flex flex-col synth:flex-row h-5/6 synth:pr-7 pt-4 items-center justify-start gap-5">
        <div className="relative w-full synth:w-3/4 h-full flex overflow-y-scroll">
          <div className="relative w-full h-fit flex flex-col gap-4 items-center justify-center">
            <div className="relative w-1/2 justify-center flex flex-row font-mana text-white text-sm uppercase">
              <div
                className={`relative bg-azul flex items-center justify-center bg-azul rounded-sm border border-y-white border-r-white px-2 py-1 w-24 h-fit hover:opacity-70 cursor-pointer bg-azul`}
              >
                fiat
              </div>
              <div
                className={`relative rounded-sm px-2 py-1 bg-azul flex items-center justify-center border border-white w-24 h-fit hover:opacity-70 cursor-pointer bg-oscurazul`}
              >
                crypto
              </div>
            </div>
            <div className="relative w-3/4 h-40 flex">
              <div className="relative border border-ligero rounded-md w-full h-full flex flex-col gap-3 p-2">
                <div className="relative w-full h-full items-start justify-start flex overflow-scroll">
                  <div className="flex flex-col gap-2 items-start justify-start w-fit preG:w-full h-fit">
                    <div className="relative w-full h-full font-mana text-white text-xs flex items-center justify-center text-center">
                      fill up your cart
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative justify-start items-start w-3/4  h-fit flex flex-row font-mana text-ama text-base gap-3">
              <div className="relative w-fit h-fit">Total:</div>
              <div className="relative w-fit h-fit">{"$ 0"}</div>
            </div>
            <ShippingInfo
              fulfillmentDetails={fulfillmentDetails}
              dispatch={dispatch}
            />
            {
              <div className="relative w-3/4 justify-start items-center flex flex-row gap-1">
                {ACCEPTED_TOKENS_MUMBAI?.map(
                  (item: string[], index: number) => {
                    return (
                      <div
                        className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95`}
                        key={index}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                          className="flex"
                          draggable={false}
                          width={30}
                          height={35}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            }
            <Crypto
              address={address}
              openConnectModal={openConnectModal}
              signInLoading={signInLoading}
              //   handleCheckoutCrypto={handleCheckoutCrypto}
              //   cryptoCheckoutLoading={cryptoCheckoutLoading}
              //   approved={approved}
              //   handleApproveSpend={handleApproveSpend}
              cartItems={cartItems}
              dispatch={dispatch}
              connectedPKP={connectedPKP}
              chain={chain}
              openChainModal={openChainModal}
            />
          </div>
        </div>
      </div>
      <div
        className="relative flex justify-center w-full preG:w-fit preG:absolute text-white flex font-mana text-sm sm:text-xl 900:text-3xl uppercase preG:bottom-4 preG:pt-0 pt-4"
        draggable={false}
      >
        make it yours
      </div>
    </div>
  );
};

export default PlainGrid;
