import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps } from "../types/synth.types";
import { CartItem } from "@/components/Common/types/common.types";
import { setImageViewer } from "../../../../../redux/reducers/imageViewerSlice";
import Checkout from "./Checkout";

const Grid: FunctionComponent<GridProps> = ({
  dispatch,
  scrollRef,
  cartItems,
  signInLoading,
  address,
  openConnectModal,
  fulfillmentDetails,
  chain,
  openChainModal,
  handleApproveSpend,
  handleCheckoutCrypto,
  approved,
  cryptoCheckoutLoading,
  checkoutCurrency,
  router,
  setCheckoutCurrency,
  setCartItem,
  encryptFulfillment,
  cartItem,
  oracleValue,
  setOpenCountryDropDown,
  openCountryDropDown,
  setFulfillmentDetails,
  startIndex,
  setStartIndex,
  encrypted,
  lensConnected,
  handleLensSignIn,
  setEncrypted,
  t,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-120 synth:h-100 flex flex-col gap-2"
      ref={scrollRef}
    >
      <div className="absolute w-full h-full hidden preG:flex">
        <Image
          alt="copy"
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
          draggable={false}
        />
      </div>
      <div className="relative w-full flex flex-col synth:flex-row h-5/6 synth:pr-7 pt-4 items-center justify-start gap-5">
        <Checkout
          router={router}
          t={t}
          setEncrypted={setEncrypted}
          lensConnected={lensConnected}
          handleLensSignIn={handleLensSignIn}
          setFulfillmentDetails={setFulfillmentDetails}
          address={address}
          setOpenCountryDropDown={setOpenCountryDropDown}
          openCountryDropDown={openCountryDropDown}
          encrypted={encrypted}
          openConnectModal={openConnectModal}
          signInLoading={signInLoading}
          cartItems={cartItems}
          cartItem={cartItem}
          handleCheckoutCrypto={handleCheckoutCrypto}
          cryptoCheckoutLoading={cryptoCheckoutLoading}
          dispatch={dispatch}
          checkoutCurrency={checkoutCurrency}
          setCheckoutCurrency={setCheckoutCurrency}
          fulfillmentDetails={fulfillmentDetails}
          approved={approved}
          handleApproveSpend={handleApproveSpend}
          oracleValue={oracleValue}
          setCartItem={setCartItem}
          chain={chain}
          openChainModal={openChainModal}
          encryptFulfillment={encryptFulfillment}
        />
        <div className="relative w-3/4 preG:w-96 h-96 xl:h-80 justify-end flex items-center">
          <div
            className="relative w-full h-full rounded-md border border-ama cursor-pointer hover:opacity-80 bg-cross"
            onClick={() =>
              cartItems?.length > 0 &&
              dispatch(
                setImageViewer({
                  actionValue: true,
                  actionImage:
                    cartItem?.item?.collectionMetadata?.images?.[0]?.split(
                      "ipfs://"
                    )?.[1],
                })
              )
            }
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                cartItem?.item?.collectionMetadata?.images?.[0]?.split(
                  "ipfs://"
                )?.[1]
              }`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div className="relative preG:absolute preG:bottom-6 preG:right-2 md:right-12 w-full preG:w-fit h-fit flex flex-col preG:flex-row gap-3 text-white items-center justify-center text-center">
        <div className="relative flex flex-col preG:flex-row w-full h-full gap-3 items-center justify-center">
          <div className="relative w-full h-fit flex items-center justify-center gap-2">
            {(cartItems?.length <= 4
              ? cartItems
              : Array(4)
                  .fill(null)
                  .map(
                    (_, index) =>
                      cartItems[(startIndex + index) % cartItems.length]
                  )
            ).map((item: CartItem, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-10 synth:w-20 h-10 rounded-md border border-ama cursor-pointer bg-cross hover:opacity-80"
                  onClick={() => setCartItem(item)}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      item?.item?.collectionMetadata?.images?.[0]?.split(
                        "ipfs://"
                      )?.[1]
                    }`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
          <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
            <div
              className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center"
              onClick={() => {
                setStartIndex((prevIndex) =>
                  prevIndex === 0 ? cartItems?.length - 1 : prevIndex - 1
                );
                setCartItem(cartItems[startIndex]);
              }}
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                layout="fill"
                draggable={false}
              />
            </div>
            <div
              className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center"
              onClick={() => {
                setStartIndex(
                  (prevIndex) => (prevIndex + 1) % cartItems?.length
                );
                setCartItem(cartItems[startIndex]);
              }}
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                layout="fill"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`relative flex justify-center w-full preG:w-fit preG:absolute text-white flex text-sm sm:text-xl tablet:text-3xl uppercase preG:bottom-4 preG:pt-0 pt-4 ${
          router.locale == "es" ? "font-bit" : "font-mana"
        }`}
        draggable={false}
      >
        {t("yours")}
      </div>
    </div>
  );
};

export default Grid;
