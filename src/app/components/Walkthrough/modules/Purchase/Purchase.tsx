import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext, ScrollContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { CartItem } from "../../../Prerolls/types/prerolls.types";
import { usePathname } from "next/navigation";
import Checkout from "./Checkout";
import useCheckout from "../../hooks/useCheckout";
import { useAccount } from "wagmi";

const Purchase: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const scrollContext = useContext(ScrollContext);
  const context = useContext(ModalContext);
  const path = usePathname();
  const { address } = useAccount();
  const {
    collectPostLoading,
    collectItem,
    fulfillmentDetails,
    setFulfillmentDetails,
    checkoutCurrency,
    setCheckoutCurrency,
    openCountryDropdown,
    setOpenCountryDropdown,
    approveSpend,
    chooseCartItem,
    setChooseCartItem,
    isApprovedSpend,
    startIndex,
    setStartIndex,
  } = useCheckout(dict, address);
  return (
    <div className="relative w-full h-fit flex flex-col">
      <div
        className="relative w-full h-120 synth:h-100 flex flex-col gap-2"
        ref={scrollContext?.scrollRef}
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
            dict={dict}
            setCartItem={setChooseCartItem}
            cartItem={chooseCartItem}
            handleCheckoutCrypto={collectItem}
            cryptoCheckoutLoading={collectPostLoading}
            setCheckoutCurrency={setCheckoutCurrency}
            checkoutCurrency={checkoutCurrency}
            fulfillmentDetails={fulfillmentDetails}
            approved={isApprovedSpend}
            handleApproveSpend={approveSpend}
            openCountryDropDown={openCountryDropdown}
            setOpenCountryDropDown={setOpenCountryDropdown}
            setFulfillmentDetails={setFulfillmentDetails}

          />
          <div className="relative w-3/4 preG:w-96 h-96 xl:h-80 justify-end flex items-center">
            <div
              className="relative w-full h-full rounded-md border border-ama cursor-pointer hover:opacity-80 bg-cross"
              onClick={() =>
                Number(context?.cartItems?.length) > 0 &&
                context?.setVerImagen(`${INFURA_GATEWAY}/ipfs/${
                  chooseCartItem?.item?.metadata?.images?.[0]?.split(
                    "ipfs://"
                  )?.[1]
                }`)
              }
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${
                  chooseCartItem?.item?.metadata?.images?.[0]?.split(
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
              {(
                (Number(context?.cartItems?.length) <= 4
                  ? context?.cartItems || []
                  : (Array.from(
                      { length: 4 },
                      (_, index) =>
                        context?.cartItems?.[
                          (startIndex + index) % context?.cartItems?.length
                        ]
                    ) as CartItem[])) || []
              ).map((item: CartItem, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-10 synth:w-20 h-10 rounded-md border border-ama cursor-pointer bg-cross hover:opacity-80"
                    onClick={() => setChooseCartItem(item)}
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        item?.item?.metadata?.images?.[0]?.split(
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
                    prevIndex === 0
                      ? Number(context?.cartItems?.length) - 1
                      : prevIndex - 1
                  );
                  setChooseCartItem(context?.cartItems?.[startIndex]!);
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
                    (prevIndex) =>
                      (prevIndex + 1) % Number(context?.cartItems?.length)
                  );
                  setChooseCartItem(context?.cartItems?.[startIndex]!);
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
            path?.includes("/es/") ? "font-bit" : "font-mana"
          }`}
          draggable={false}
        >
          {dict?.Common?.yours}
        </div>
      </div>
    </div>
  );
};

export default Purchase;
