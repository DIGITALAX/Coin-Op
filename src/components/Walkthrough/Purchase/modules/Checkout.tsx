import { FunctionComponent } from "react";
import { CheckoutProps } from "../types/synth.types";
import Crypto from "./Crypto";
import Items from "./Items";
import ShippingInfo from "./ShippingInfo";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "../../../../../lib/constants";
import Image from "next/legacy/image";

const Checkout: FunctionComponent<CheckoutProps> = ({
  openConnectModal,
  address,
  signInLoading,
  cartItems,
  cartItem,
  handleCheckoutCrypto,
  cryptoCheckoutLoading,
  dispatch,
  setCheckoutCurrency,
  checkoutCurrency,
  fulfillmentDetails,
  approved,
  handleApproveSpend,
  oracleValue,
  setCartItem,
  chain,
  openChainModal,
  setOpenCountryDropDown,
  openCountryDropDown,
  setFulfillmentDetails,
  encryptFulfillment,
  encrypted,
  lensConnected,
  handleLensSignIn,
  setEncrypted,
}): JSX.Element => {
  return (
    <div className="relative w-full synth:w-3/4 h-full flex overflow-y-scroll">
      <div className="relative w-full h-fit flex flex-col gap-4 items-center justify-center">
        <div className="relative w-3/4 text-center h-fit flex items-center justify-center break-words font-mana text-white text-xs">
          Claim your cart. Each Lens collect is unique like you—one by one
          checkouts give them that personal touch. <br />
          <br /> No batch buys at this time.
        </div>
        <Items
          setEncrypted={setEncrypted}
          setCartItem={setCartItem}
          cartItems={cartItems}
          cartItem={cartItem}
          dispatch={dispatch}
          checkoutCurrency={checkoutCurrency}
          oracleValue={oracleValue}
        />
        <div className="relative justify-start items-start w-3/4  h-fit flex flex-row font-mana text-ama text-base gap-3">
          <div className="relative w-fit h-fit">Cart Total:</div>
          <div className="relative w-fit h-fit">
            {`${
              ACCEPTED_TOKENS.find(
                (subArray) =>
                  subArray[2]?.toLowerCase() === checkoutCurrency?.toLowerCase()
              )?.[1]
            } `}
            {(
              (cartItems?.reduce(
                (accumulator, currentItem) =>
                  accumulator +
                  Number(
                    currentItem?.item?.prices?.[currentItem.chosenIndex!]
                  ) *
                    currentItem.chosenAmount,
                0
              ) *
                10 ** 18) /
              Number(
                oracleValue?.find(
                  (oracle) =>
                    oracle.currency?.toLowerCase() ===
                    checkoutCurrency?.toLowerCase()
                )?.rate
              )
            )?.toFixed(2)}
          </div>
        </div>

        <ShippingInfo
          fulfillmentDetails={fulfillmentDetails}
          openCountryDropDown={openCountryDropDown}
          setOpenCountryDropDown={setOpenCountryDropDown}
          setEncrypted={setEncrypted}
          setFulfillmentDetails={setFulfillmentDetails}
          encrypted={encrypted}
        />
        <div className="relative w-3/4 justify-start items-center flex flex-row gap-3">
          {ACCEPTED_TOKENS?.map((item: string[], index: number) => {
            return (
              <div
                className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                  checkoutCurrency?.toLowerCase() === item[2]?.toLowerCase()
                    ? "opacity-50"
                    : "opacity-100"
                }`}
                key={index}
                onClick={() => setCheckoutCurrency(item[2])}
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
          })}
        </div>
        <div className="relative justify-start items-start w-3/4  h-fit flex flex-row font-mana text-sol text-xs gap-3">
          <div className="relative w-fit h-fit">Selected Item Total:</div>
          <div className="relative w-fit h-fit">
            {`${
              ACCEPTED_TOKENS.find(
                (subArray) =>
                  subArray[2]?.toLowerCase() === checkoutCurrency?.toLowerCase()
              )?.[1]
            } `}
            {(
              (cartItems
                ?.filter(
                  (item) =>
                    item?.item?.collectionMetadata?.title ==
                    cartItem?.item?.collectionMetadata?.title
                )
                ?.reduce(
                  (accumulator, currentItem) =>
                    accumulator +
                    Number(
                      currentItem?.item?.prices?.[currentItem.chosenIndex!]
                    ) *
                      currentItem.chosenAmount,
                  0
                ) *
                10 ** 18) /
              Number(
                oracleValue?.find(
                  (oracle) =>
                    oracle.currency?.toLowerCase() ===
                    checkoutCurrency?.toLowerCase()
                )?.rate
              )
            )?.toFixed(2)}
          </div>
        </div>
        <Crypto
          address={address}
          lensConnected={lensConnected}
          handleLensSignIn={handleLensSignIn}
          openConnectModal={openConnectModal}
          signInLoading={signInLoading}
          handleCheckoutCrypto={handleCheckoutCrypto}
          cryptoCheckoutLoading={cryptoCheckoutLoading}
          approved={approved}
          handleApproveSpend={handleApproveSpend}
          cartItems={cartItems}
          chain={chain}
          openChainModal={openChainModal}
          encryptFulfillment={encryptFulfillment}
          encrypted={encrypted}
        />
      </div>
    </div>
  );
};

export default Checkout;
