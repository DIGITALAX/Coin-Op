import { FunctionComponent, JSX, useContext } from "react";
import { AppMarketProps } from "../types/common.types";
import Image from "next/image";
import {
  INFURA_GATEWAY,
  MATERIAL_CHILD,
  COLOR_CHILD,
  SIZES,
  APP_COLORS,
} from "@/app/lib/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAppMarket } from "../hooks/useAppMarket";
import { ModalContext } from "@/app/providers";
import { Parent } from "../../AppMarket/types/appmarket.types";

const AppMarket: FunctionComponent<AppMarketProps> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { loading, error, hasMore, loadMore } = useAppMarket(dict);

  const getMaterialAndColor = (item: Parent) => {
    const materialRef = item?.childReferences?.find(
      (ref) =>
        ref?.childContract?.toLowerCase() === MATERIAL_CHILD?.toLowerCase()
    );
    const colorRef = item?.childReferences?.find(
      (ref) => ref?.childContract?.toLowerCase() === COLOR_CHILD?.toLowerCase()
    );
    return { materialRef, colorRef };
  };

  return (
    <div className="relative w-full h-fit flex">
      <div className="absolute top-0 left-0 flex w-full h-full">
        <Image
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          src={`${INFURA_GATEWAY}/ipfs/QmXZSyTXMxttm9jxioNH3k5L9uWpnbFTrTUK85muBen21F`}
          alt="spots"
          draggable={false}
        />
      </div>
      <div className="relative w-full h-[50rem] flex overflow-y-scroll justify-start items-start p-2">
        <InfiniteScroll
          dataLength={context?.parents?.length!}
          loader={<></>}
          hasMore={hasMore}
          next={loadMore}
          className="w-full h-fit items-start justify-start grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {loading || Number(context?.parents?.length) < 1
            ? Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="relative w-full h-fit flex flex-col rounded-lg bg-nube p-1 animate-pulse"
                >
                  <div
                    className={`relative w-full h-80 flex p-4 rounded-lg ${
                      APP_COLORS[i % 9]
                    }`}
                  ></div>
                  <div className="relative w-full h-20 flex"></div>
                </div>
              ))
            : context?.parents?.map((item, index: number) => {
                const { materialRef, colorRef } = getMaterialAndColor(item);
                return (
                  <div
                    key={index}
                    className={`relative w-full h-fit flex flex-col rounded-lg p-1 ${
                      APP_COLORS[index % 9]
                    }`}
                  >
                    <div
                      className={`relative w-full h-80 flex p-4 rounded-lg cursor-pointer hover:opacity-80 ${
                        APP_COLORS[index % 9]
                      }`}
                      onClick={() => context?.setParentExpand(item)}
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          item?.metadata?.image?.split("ipfs://")?.[1]
                        }`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        draggable={false}
                        alt={item?.metadata?.title}
                      />
                      <div className="absolute bottom-2 right-2 flex flex-row gap-2">
                        {materialRef?.child?.metadata?.image && (
                          <div className="relative w-8 h-8 rounded-full border border-white/50 overflow-hidden">
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/${
                                materialRef?.child?.metadata?.image?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                              layout="fill"
                              objectFit="cover"
                              alt="material"
                              draggable={false}
                            />
                          </div>
                        )}
                        {colorRef?.child?.metadata?.image && (
                          <div className="relative w-8 h-8 rounded-full border border-white/50 overflow-hidden">
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/${
                                colorRef?.child?.metadata?.image?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                              layout="fill"
                              objectFit="cover"
                              alt="color"
                              draggable={false}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative w-full h-fit flex flex-col gap-2 p-2 text-white font-bit text-xs">
                      <div className="relative w-fit h-fit">
                        {item?.metadata?.title}
                      </div>
                      <div className="relative w-fit h-fit text-[0.6rem] text-ama">
                        {Number(item.totalPhysicalPrice) / 10 ** 18} MONA
                      </div>
                      <div className="relative w-fit h-fit text-[0.55rem] text-white/70">
                        {item?.currentPhysicalEditions} /{" "}
                        {item?.maxPhysicalEditions} sold
                      </div>
                      <div className="relative w-full h-fit flex flex-row gap-1 flex-wrap">
                        {SIZES.map((size) => (
                          <div
                            key={size}
                            className={`relative w-fit h-fit px-2 py-1 text-xxs cursor-pointer border ${
                              item?.chosenSize?.toLowerCase() ===
                              size?.toLowerCase()
                                ? "bg-ama text-black border-ama"
                                : "bg-black text-white border-white/50"
                            } hover:opacity-70`}
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedParents = context?.parents?.map(
                                (parent) =>
                                  parent?.metadata?.id === item?.metadata?.id
                                    ? { ...parent, chosenSize: size }
                                    : parent
                              );
                              context?.setParents(updatedParents || []);
                            }}
                          >
                            {size?.toUpperCase()}
                          </div>
                        ))}
                      </div>
                      <div
                        className="relative w-5 h-4 ml-auto cursor-pointer  hover:opacity-70"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();

                          if (Number(item?.status) !== 2) {
                            context?.setModalOpen(dict?.Common?.eagerActive);
                            return;
                          }

                          if (!item?.chosenSize) {
                            return;
                          }

                          const existing = context?.cartItemsMarket?.findIndex(
                            (cartItem) =>
                              cartItem?.item?.metadata?.id ===
                                item?.metadata?.id &&
                              cartItem?.item?.chosenSize === item?.chosenSize
                          );

                          let newCartItems = [
                            ...(context?.cartItemsMarket || []),
                          ];

                          if (existing !== undefined && existing !== -1) {
                            newCartItems = [
                              ...newCartItems.slice(0, existing),
                              {
                                ...newCartItems[existing],
                                chosenAmount:
                                  newCartItems[existing].chosenAmount + 1,
                              },
                              ...newCartItems.slice(existing + 1),
                            ];
                          } else {
                            newCartItems.push({
                              item: item,
                              chosenAmount: 1,
                            });
                          }

                          context?.setCartItemsMarket?.(newCartItems);
                          context?.setPurchaseMode("appMarket");
                          context?.setCartAddAnim?.(item?.metadata?.image);
                        }}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/QmcDmX2FmwjrhVDLpNii6NdZ4KisoPLMjpRUheB6icqZcV`}
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          alt="cart"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AppMarket;
