import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps } from "../types/synth.types";
import { CartItem } from "@/components/Common/types/common.types";
import { setImageViewer } from "../../../../../redux/reducers/imageViewerSlice";
import Checkout from "./Checkout";
import useCheckout from "../hooks/useCheckout";

const Grid: FunctionComponent<GridProps> = ({
  dispatch,
  scrollRef,
  cartItems,
  signInLoading,
  address,
  openConnectModal,
}): JSX.Element => {
  const {
    cartItem,
    paymentType,
    setPaymentType,
    handleCheckoutFiat,
    handleCheckoutCrypto,
    cryptoCheckoutLoading,
    fiatCheckoutLoading,
    checkoutCurrency,
    setCheckoutCurrency,
    setCartItem,
    startIndex,
    setStartIndex,
    fulfillmentDetails,
    setFulfillmentDetails,
    approved,
    handleApproveSpend,
    oracleValue,
  } = useCheckout();
  return (
    <div className="relative w-full h-100 flex flex-col gap-2" ref={scrollRef}>
      <div className="absolute w-full h-full flex">
        <Image
          alt="copy"
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
          draggable={false}
        />
      </div>
      <div className="relative w-full flex flex-row h-5/6 pr-7 pt-4 items-center justify-start gap-5">
        <Checkout
          address={address}
          openConnectModal={openConnectModal}
          signInLoading={signInLoading}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          cartItems={cartItems}
          cartItem={cartItem}
          handleCheckoutCrypto={handleCheckoutCrypto}
          handleCheckoutFiat={handleCheckoutFiat}
          fiatCheckoutLoading={fiatCheckoutLoading}
          cryptoCheckoutLoading={cryptoCheckoutLoading}
          dispatch={dispatch}
          checkoutCurrency={checkoutCurrency}
          setCheckoutCurrency={setCheckoutCurrency}
          fulfillmentDetails={fulfillmentDetails}
          setFulfillmentDetails={setFulfillmentDetails}
          approved={approved}
          handleApproveSpend={handleApproveSpend}
          oracleValue={oracleValue}
          setCartItem={setCartItem}
        />
        <div className="relative w-96 h-80 justify-end flex items-center">
          <div
            className="relative w-full h-full rounded-md border border-ama cursor-pointer hover:opacity-80 bg-cross"
            onClick={() =>
              cartItems?.length > 0 &&
              dispatch(
                setImageViewer({
                  actionValue: true,
                  actionImage: cartItem?.uri
                    ? cartItem?.uri?.image?.split("ipfs://")[1]
                    : cartItems[0]?.uri?.image?.split("ipfs://")[1],
                })
              )
            }
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                cartItem?.uri
                  ? cartItem?.uri?.image?.split("ipfs://")[1]
                  : cartItems[0]?.uri?.image?.split("ipfs://")[1]
              }`}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-12 w-fit h-fit flex flex-row gap-3 text-white items-center justify-center text-center">
        <div className="relative flex flex-row w-full h-full gap-3 items-center justify-center">
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
                  className="relative w-20 h-10 rounded-md border border-ama cursor-pointer bg-cross hover:opacity-80"
                  onClick={() => setCartItem(item)}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      item?.uri?.image?.split("ipfs://")[1]
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
                  prevIndex === 0 ? cartItems.length - 1 : prevIndex - 1
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
                  (prevIndex) => (prevIndex + 1) % cartItems.length
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
        className="absolute text-white flex font-mana text-3xl uppercase bottom-4"
        draggable={false}
      >
        make it yours
      </div>
    </div>
  );
};

export default Grid;
