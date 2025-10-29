import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext, ScrollContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
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
    checkoutLoading,
    collectItem,
    fulfillmentDetails,
    setFulfillmentDetails,
    checkoutCurrency,
    setCheckoutCurrency,
    openCountryDropdown,
    setOpenCountryDropdown,
    approveSpend,
    isApprovedSpend,
    startIndex,
    setStartIndex,
    chooseCartItem,
    setChooseCartItem,
    buyMarketItems,
  } = useCheckout(dict, address);

  const getImageUrl = (item: any) => {
    if (!item) return "";
    if (context?.purchaseMode === "appMarket") {
      return `${INFURA_GATEWAY}/ipfs/${
        item?.item?.metadata?.image?.split("ipfs://")?.[1]
      }`;
    }
    return `${INFURA_GATEWAY}/ipfs/${
      item?.item?.metadata?.images?.[0]?.split("ipfs://")?.[1]
    }`;
  };

  return (
    <div className="relative w-full h-fit flex flex-col">
      <div
        className="relative w-full h-fit flex flex-col gap-2"
        ref={scrollContext?.scrollRef}
      >
        <div className="relative w-full h-fit flex items-center justify-center gap-2 mb-4">
          <div
            className={`relative w-fit h-fit px-4 py-2 cursor-pointer border font-bit text-xs rounded-md ${
              context?.purchaseMode === "prerolls"
                ? "bg-ama text-black border-ama"
                : "bg-black text-white border-white/50"
            } hover:opacity-70 active:scale-95`}
            onClick={() => context?.setPurchaseMode("prerolls")}
          >
            {dict?.Common?.prerolls}
          </div>
          <div
            className={`relative w-fit h-fit px-4 py-2 cursor-pointer border font-bit text-xs rounded-md ${
              context?.purchaseMode === "appMarket"
                ? "bg-ama text-black border-ama"
                : "bg-black text-white border-white/50"
            } hover:opacity-70 active:scale-95`}
            onClick={() => context?.setPurchaseMode("appMarket")}
          >
            {dict?.Common?.appMarket}
          </div>
        </div>
        <div className="relative w-full flex flex-col synth:flex-row items-center justify-start gap-5">
          <Checkout
            dict={dict}
            setCartItem={setChooseCartItem}
            cartItem={chooseCartItem}
            handleCheckout={
              context?.purchaseMode == "prerolls" ? collectItem : buyMarketItems
            }
            checkoutLoading={checkoutLoading}
            setCheckoutCurrency={setCheckoutCurrency}
            checkoutCurrency={checkoutCurrency}
            fulfillmentDetails={fulfillmentDetails}
            approved={isApprovedSpend}
            handleApproveSpend={approveSpend}
            openCountryDropDown={openCountryDropdown}
            setOpenCountryDropDown={setOpenCountryDropdown}
            setFulfillmentDetails={setFulfillmentDetails}
            purchaseMode={context?.purchaseMode!}
            currentCartItems={
              context?.purchaseMode == "prerolls"
                ? context?.cartItems
                : context?.cartItemsMarket
            }
          />
          <div className="relative w-full h-fit flex flex-col gap-3 justify-center items-center">
            <div className="relative w-full preG:w-96 h-96 xl:h-80 justify-end flex items-center">
              {Number(context?.cartItems?.length) > 0 && chooseCartItem ? (
                <div
                  className="relative w-full h-full rounded-md border border-ama cursor-pointer hover:opacity-80 bg-cross"
                  onClick={() =>
                    Number(context?.cartItems?.length) > 0 &&
                    context?.setVerImagen(getImageUrl(chooseCartItem))
                  }
                >
                  <Image
                    src={getImageUrl(chooseCartItem)}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="relative w-full h-full rounded-md border border-ama bg-cross flex items-center justify-center text-white font-bit text-xs">
                  {dict?.Common?.fill}
                </div>
              )}
            </div>
            <div className="relative w-full preG:w-fit h-fit flex flex-col preG:flex-row gap-3 text-white items-center justify-center text-center">
              <div className="relative flex flex-col preG:flex-row w-full h-full gap-3 items-center justify-center">
                <div className="relative w-full h-fit flex items-center justify-center gap-2">
                  {(
                    (Number(context?.cartItems?.length) <= 4
                      ? context?.purchaseMode == "prerolls"
                        ? context?.cartItems
                        : context?.cartItemsMarket || []
                      : (Array.from(
                          { length: 4 },
                          (_, index) =>
                            (context?.purchaseMode == "prerolls"
                              ? context?.cartItems
                              : context?.cartItemsMarket)?.[
                              ((context?.purchaseMode == "prerolls"
                                ? startIndex.prerolls
                                : startIndex.market) +
                                index) %
                                Number(context?.cartItems?.length)
                            ]
                        ) as any[])) || []
                  ).map((item: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-10 synth:w-20 h-10 rounded-md border border-ama cursor-pointer bg-cross hover:opacity-80"
                        onClick={() => setChooseCartItem(item)}
                      >
                        <Image
                          src={getImageUrl(item)}
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
                      setStartIndex((prev) => ({
                        ...prev,
                        [context?.purchaseMode == "prerolls"
                          ? "prerolls"
                          : "market"]:
                          (context?.purchaseMode == "prerolls"
                            ? startIndex.prerolls
                            : startIndex.market) === 0
                            ? Number(context?.cartItems?.length) - 1
                            : (context?.purchaseMode == "prerolls"
                                ? startIndex.prerolls
                                : startIndex.market) - 1,
                      }));
                      setChooseCartItem((prev) => ({
                        ...prev,
                        [context?.purchaseMode == "prerolls"
                          ? "prerolls"
                          : "market"]: (context?.purchaseMode == "prerolls"
                          ? context?.cartItems
                          : context?.cartItemsMarket)?.[
                          context?.purchaseMode == "prerolls"
                            ? startIndex.prerolls
                            : startIndex.market
                        ]!,
                      }));
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
                      setStartIndex((prev) => ({
                        ...prev,
                        [context?.purchaseMode == "prerolls"
                          ? "prerolls"
                          : "market"]:
                          ((context?.purchaseMode == "prerolls"
                            ? startIndex.prerolls
                            : startIndex.market) +
                            1) %
                          Number(context?.cartItems?.length),
                      }));
                      setChooseCartItem((prev) => ({
                        ...prev,
                        [context?.purchaseMode == "prerolls"
                          ? "prerolls"
                          : "market"]: (context?.purchaseMode == "prerolls"
                          ? context?.cartItems
                          : context?.cartItemsMarket)?.[
                          context?.purchaseMode == "prerolls"
                            ? startIndex.prerolls
                            : startIndex.market
                        ]!,
                      }));
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
              className={`relative flex justify-center w-full preG:w-fit text-white flex text-sm sm:text-xl tablet:text-3xl uppercase preG:pt-0 pt-4 ${
                path?.includes("/es/") ? "font-bit" : "font-mana"
              }`}
              draggable={false}
            >
              {dict?.Common?.yours}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
