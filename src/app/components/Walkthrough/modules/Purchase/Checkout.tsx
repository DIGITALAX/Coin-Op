import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ASSETS, INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { usePathname } from "next/navigation";
import { CheckoutProps } from "../../types/walkthrough.types";
import Crypto from "./Crypto";
import Items from "./Items";
import ShippingInfo from "./ShippingInfo";

const Checkout: FunctionComponent<CheckoutProps> = ({
  dict,
  setCartItem,
  cartItem,
  handleCheckoutCrypto,
  cryptoCheckoutLoading,
  setCheckoutCurrency,
  checkoutCurrency,
  fulfillmentDetails,
  approved,
  handleApproveSpend,
  openCountryDropDown,
  setOpenCountryDropDown,
  setFulfillmentDetails,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();
  return (
    <div className="relative w-full synth:w-3/4 h-full flex overflow-y-scroll">
      <div className="relative w-full h-fit flex flex-col gap-4 items-center justify-center">
        <div
          className={`relative w-3/4 text-center h-fit flex items-center justify-center break-words  text-white text-xs whitespace-pre-line ${
            path?.includes("/es/") ? "font-bit" : "font-mana"
          }`}
        >
          {dict?.Common?.claim}
        </div>
        <Items
          dict={dict}
          setCartItem={setCartItem}
          cartItem={cartItem}
          checkoutCurrency={checkoutCurrency}
        />
        <div
          className={`relative justify-start items-start w-3/4  h-fit flex flex-row  text-ama text-base gap-3 ${
            path?.includes("/es/") ? "font-bit" : "font-mana"
          }`}
        >
          <div className="relative w-fit h-fit">{dict?.Common?.cart}</div>
          <div className="relative w-fit h-fit">
            {`${
              ASSETS.find(
                (subArray) =>
                  subArray?.contract?.address?.toLowerCase() ===
                  checkoutCurrency?.toLowerCase()
              )?.symbol
            } `}
            {(
              ((context?.cartItems || [])?.reduce(
                (accumulator, currentItem) =>
                  accumulator +
                  Number(currentItem?.item?.price) * currentItem.chosenAmount,
                0
              ) *
                10 ** 18) /
                (Number(
                  context?.oracleData?.find(
                    (oracle) =>
                      oracle.currency?.toLowerCase() ===
                      checkoutCurrency?.toLowerCase()
                  )?.rate
                ) || 0) || 0
            )?.toFixed(2)}
          </div>
        </div>
        <ShippingInfo
          dict={dict}
          fulfillmentDetails={fulfillmentDetails}
          openCountryDropDown={openCountryDropDown}
          setOpenCountryDropDown={setOpenCountryDropDown}
          setFulfillmentDetails={setFulfillmentDetails}
          cryptoCheckoutLoading={cryptoCheckoutLoading}
        />
        <div className="relative w-3/4 justify-start items-center flex flex-row gap-3">
          {ASSETS?.map((item, index: number) => {
            return (
              <div
                className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                  checkoutCurrency?.toLowerCase() ===
                  item?.contract?.address?.toLowerCase()
                    ? "opacity-50"
                    : "opacity-100"
                }`}
                key={index}
                onClick={() => setCheckoutCurrency(item?.contract?.address)}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${item?.cover}`}
                  className="flex"
                  draggable={false}
                  width={30}
                  height={35}
                />
              </div>
            );
          })}
        </div>
        <div
          className={`relative justify-start items-start w-3/4  h-fit flex flex-row text-sol text-xs gap-3 ${
            path?.includes("/en/") ? "font-mana" : "font-bit"
          }`}
        >
          <div className="relative w-fit h-fit">{dict?.Common?.total}</div>
          <div className="relative w-fit h-fit">
            {`${
              ASSETS.find(
                (subArray) =>
                  subArray?.contract?.address?.toLowerCase() ===
                  checkoutCurrency?.toLowerCase()
              )?.symbol
            } `}
            {(
              ((context?.cartItems || [])?.reduce(
                (accumulator, currentItem) =>
                  accumulator +
                  Number(currentItem?.item?.price) * currentItem.chosenAmount,
                0
              ) *
                10 ** 18) /
              Number(
                context?.oracleData?.find(
                  (oracle) =>
                    oracle.currency?.toLowerCase() ===
                    checkoutCurrency?.toLowerCase()
                )?.rate
              )
            )?.toFixed(2)}
          </div>
        </div>
        <Crypto
          dict={dict}
          handleCheckoutCrypto={handleCheckoutCrypto}
          cryptoCheckoutLoading={cryptoCheckoutLoading}
          approved={approved}
          handleApproveSpend={handleApproveSpend}
        />
      </div>
    </div>
  );
};

export default Checkout;
