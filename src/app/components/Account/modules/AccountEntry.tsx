"use client";

import { ModalContext } from "@/app/providers";
import { useModal } from "connectkit";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { useAccount } from "wagmi";
import useOrders from "../hooks/useOrders";
import Order from "./Order";
import CompositeOrder from "./CompositeOrder";

export default function AccountEntry({ dict }: { dict: any }) {
  const path = usePathname();
  const context = useContext(ModalContext);
  const { isConnected, chainId, address } = useAccount();
  const { openOnboarding, openSwitchNetworks } = useModal();
  const {
    ordersLoading,
    handleDecryptFulfillment,
    decryptLoading,
    orderOpen,
    setOrderOpen,
    allOrders,
    compositeOrders,
  } = useOrders(address);
  return (
    <div className="relative w-full xl:w-[calc(100vw-35rem)] h-full flex flex-col gap-5">
      <Head>
        <title>Coin Op | Account</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="og:image"
          content="https://coinop.themanufactory.xyz/card.png/"
        />
      </Head>
      <div className="relative w-full h-full flex flex-col items-center gap-16 overflow-y-scroll justify-start overflow-x-hidden">
        <div className="relative w-full h-full flex flex-col text-white gap-4">
          <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center">
            {dict?.Account?.all}
          </div>
          {!isConnected ? (
            <div
              className="relative w-full h-fit justify-center text-left items-center cursor-pointer text-white font-mana text-base"
              onClick={() =>
                !isConnected
                  ? openOnboarding
                  : isConnected && chainId !== 232 && openSwitchNetworks
              }
            >
              {dict?.Common?.connect}
            </div>
          ) : ordersLoading ? (
            Array.from({ length: 3 }).map((_, index: number) => {
              return (
                <div
                  key={index}
                  className="relative h-20 border border-white w-full"
                  id="staticLoad"
                ></div>
              );
            })
          ) : !ordersLoading && allOrders?.length < 1 ? (
            <div
              className={`relative w-full h-fit justify-center text-left items-center cursor-pointer text-white text-base whitespace-pre-line ${
                path?.includes("/en/") ? "font-mana" : "font-bit"
              }`}
              onClick={() => context?.setPrerollAnim(true)}
            >
              {dict?.Account?.shop}
            </div>
          ) : (
            <>
              {allOrders?.map((order, index: number) => {
                return (
                  <Order
                    key={index}
                    order={order}
                    orderOpen={orderOpen}
                    setOrderOpen={setOrderOpen}
                    index={index}
                    handleDecryptFulfillment={handleDecryptFulfillment}
                    decryptLoading={decryptLoading}
                    chainId={chainId}
                    connected={isConnected}
                    dict={dict}
                  />
                );
              })}
              {compositeOrders?.map((order, index: number) => {
                return (
                  <CompositeOrder
                    key={index + allOrders?.length}
                    order={order}
                    orderOpen={orderOpen}
                    setOrderOpen={setOrderOpen}
                    index={index + allOrders?.length}
                    handleDecryptFulfillment={handleDecryptFulfillment}
                    decryptLoading={decryptLoading}
                    chainId={chainId}
                    connected={isConnected}
                    dict={dict}
                  />
                );
              })}
            </>
          )}
        </div>
        <div className="relative w-full h-fit flex flex-col text-white gap-4 mt-auto">
          <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center">
            {dict?.Account?.returns}
          </div>
          <div
            className={`relative w-fit h-fit text-left justify-center break-all items-center text-sm whitespace-pre-line ${
              path?.includes("/en/") ? "font-mana" : "font-bit"
            }`}
          >
            {dict?.Account?.faq}
          </div>
        </div>
      </div>
    </div>
  );
}
