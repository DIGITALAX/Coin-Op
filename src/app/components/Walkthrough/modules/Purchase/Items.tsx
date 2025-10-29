import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import lodash from "lodash";
import { ModalContext } from "@/app/providers";
import { usePathname } from "next/navigation";
import { CartItem } from "@/app/components/Prerolls/types/prerolls.types";
import { ASSETS, INFURA_GATEWAY } from "@/app/lib/constants";
import { ItemsProps } from "../../types/walkthrough.types";
import { ChildReference } from "@/app/components/AppMarket/types/appmarket.types";

const Items: FunctionComponent<ItemsProps> = ({
  cartItem,
  checkoutCurrency,
  setCartItem,
  dict,
  purchaseMode,
  currentCartItems,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();

  return (
    <div className="relative w-full h-[12rem] flex">
      <div className="relative border border-ligero rounded-md w-full h-full flex flex-col gap-3 p-2">
        <div className="relative w-full h-full items-start justify-start flex overflow-scroll">
          <div className="flex flex-col gap-2 items-start justify-start w-fit preG:w-full h-fit">
            {Number(currentCartItems?.length) < 1 ? (
              <div
                className={`relative w-full h-full text-white text-xs flex items-center justify-center text-center ${
                  path?.includes("/es/") ? "font-bit" : "font-mana"
                }`}
              >
                {dict?.Common?.fill}
              </div>
            ) : (
              [...(currentCartItems || [])]
                ?.sort((a: any, b: any) => {
                  return a.item.metadata.title.localeCompare(
                    b.item.metadata.title
                  );
                })
                ?.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`relative w-full h-fit sm:h-12 flex sm:flex-nowrap flex-wrap flex-row gap-3 sm:gap-5 font-mana text-white text-xs justify-start sm:justify-between items-center sm:py-0 py-1.5 px-1.5 cursor-pointer ${
                        item?.item?.metadata?.title ===
                          (context?.purchaseMode == "prerolls"
                            ? cartItem.prerolls
                            : cartItem.market
                          )?.item?.metadata?.title && "bg-ama/20 rounded-md"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCartItem(item);
                      }}
                    >
                      <div className="relative w-10 h-10 rounded-lg bg-cross flex items-center justify-center">
                        <Image
                          src={
                            purchaseMode === "appMarket"
                              ? `${INFURA_GATEWAY}/ipfs/${
                                  item?.item?.metadata?.image?.split(
                                    "ipfs://"
                                  )[1]
                                }`
                              : `${INFURA_GATEWAY}/ipfs/${
                                  item?.item?.metadata?.images?.[0]?.split(
                                    "ipfs://"
                                  )[1]
                                }`
                          }
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                          draggable={false}
                        />
                      </div>
                      {purchaseMode === "prerolls" && (
                        <div
                          className="relative w-4 h-4 border border-ligero flex justify-start items-center rounded-full"
                          style={{ backgroundColor: item.chosenColor }}
                        ></div>
                      )}
                      <div className="relative w-fit h-fit flex justify-start items-center uppercase break-all">
                        {purchaseMode === "appMarket"
                          ? item?.item?.chosenSize?.toUpperCase()
                          : item.chosenSize
                              ?.replaceAll('(24" x 36")', "")
                              ?.replaceAll('(18" x 24")', "")
                              ?.replaceAll('(11" x 17")', "")
                              ?.replaceAll('(4" x 4")', "")
                              ?.replaceAll('(2" x 2")', "")
                              ?.replaceAll('(3" x 3")', "")}
                      </div>
                      <div className="relative w-fit h-fit text-ama flex whitespace-nowrap">
                        {purchaseMode === "appMarket" ? (
                          <>
                            {(
                              ((Number(item?.item?.physicalPrice) +
                                Number(
                                  item.item.childReferences.reduce(
                                    (acc: number, child: ChildReference) =>
                                      acc + Number(child?.child?.physicalPrice),
                                    0
                                  )
                                )) /
                                10 ** 18) *
                              item.chosenAmount
                            )?.toFixed(2)}{" "}
                            MONA
                          </>
                        ) : (
                          <>
                            {
                              ASSETS.find(
                                (subArray) =>
                                  subArray?.contract?.address?.toLowerCase() ===
                                  checkoutCurrency?.toLowerCase()
                              )?.symbol
                            }{" "}
                            {(
                              (Number(item?.item?.price) * 10 ** 18) /
                              Number(
                                context?.oracleData?.find(
                                  (oracle) =>
                                    oracle.currency?.toLowerCase() ===
                                    checkoutCurrency?.toLowerCase()
                                )?.rate
                              )
                            )?.toFixed(2)}
                          </>
                        )}
                      </div>
                      <div className="relative w-fit h-fit text-ama flex">
                        {item.chosenAmount}
                      </div>
                      <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                        <div
                          className="relative w-5 h-5 flex items-center justify-center rotate-90 cursor-pointer active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            if (purchaseMode === "appMarket") {
                              const totalInCart = (currentCartItems || [])
                                ?.filter(
                                  (cartItem: any) =>
                                    cartItem?.item?.metadata?.id ===
                                    item?.item?.metadata?.id
                                )
                                ?.reduce(
                                  (acc: number, curr: any) =>
                                    acc + curr.chosenAmount,
                                  0
                                );

                              const maxAvailable = Number(
                                item?.item?.maxPhysicalEditions
                              );
                              const currentSold = Number(
                                item?.item?.currentPhysicalEditions
                              );
                              const available = maxAvailable - currentSold;

                              if (
                                totalInCart + 1 > available ||
                                currentSold >= maxAvailable
                              ) {
                                context?.setModalOpen(dict?.Common?.eager);
                                return;
                              }

                              const existing = (
                                context?.cartItemsMarket || []
                              )?.findIndex(
                                (value) =>
                                  value?.item?.metadata?.id ===
                                    item?.item?.metadata?.id &&
                                  value?.item?.chosenSize ===
                                    item?.item?.chosenSize
                              );

                              context?.setCartItemsMarket([
                                ...(context?.cartItemsMarket || []).slice(
                                  0,
                                  existing
                                ),
                                {
                                  ...(context?.cartItemsMarket || [])?.[
                                    existing
                                  ],
                                  chosenAmount:
                                    (context?.cartItemsMarket || [])?.[existing]
                                      ?.chosenAmount + 1,
                                },
                                ...(context?.cartItemsMarket || []).slice(
                                  existing + 1
                                ),
                              ]);
                              return;
                            }

                            if (
                              (context?.cartItems || [])
                                ?.filter(
                                  (item) =>
                                    item?.item?.postId ==
                                    (context?.cartItems || [])?.find(
                                      (value) =>
                                        value?.item?.postId ==
                                          item?.item?.postId &&
                                        value?.chosenSize == item?.chosenSize &&
                                        value?.chosenColor == item?.chosenColor
                                    )?.item?.postId
                                )
                                ?.reduce(
                                  (accumulator, currentItem) =>
                                    accumulator + currentItem.chosenAmount,
                                  0
                                ) +
                                1 >
                                Number(
                                  (context?.cartItems || [])?.find(
                                    (value) =>
                                      value?.item?.postId ==
                                        item?.item?.postId &&
                                      value?.chosenSize == item?.chosenSize &&
                                      value?.chosenColor == item?.chosenColor
                                  )?.item?.amount
                                ) ||
                              Number(
                                (context?.cartItems || [])?.find(
                                  (value) =>
                                    value?.item?.postId == item?.item?.postId &&
                                    value?.chosenSize == item?.chosenSize &&
                                    value?.chosenColor == item?.chosenColor
                                )?.item?.amount
                              ) ==
                                Number(
                                  (context?.cartItems || [])?.find(
                                    (value) =>
                                      value?.item?.postId ==
                                        item?.item?.postId &&
                                      value?.chosenSize == item?.chosenSize &&
                                      value?.chosenColor == item?.chosenColor
                                  )?.item?.tokenIdsMinted?.length || 0
                                )
                            ) {
                              context?.setModalOpen(dict?.Common?.eager);

                              return;
                            }
                            context?.setCartItems([
                              ...(context?.cartItems || []).slice(
                                0,
                                (context?.cartItems || [])?.findIndex(
                                  (value) =>
                                    value?.item?.postId == item?.item?.postId &&
                                    value?.chosenSize == item?.chosenSize &&
                                    value?.chosenColor == item?.chosenColor
                                )
                              ),
                              {
                                ...(context?.cartItems || [])?.find(
                                  (value) =>
                                    value?.item?.postId == item?.item?.postId &&
                                    value?.chosenSize == item?.chosenSize &&
                                    value?.chosenColor == item?.chosenColor
                                )!,
                                chosenAmount:
                                  (context?.cartItems || [])?.find(
                                    (value) =>
                                      value?.item?.postId ==
                                        item?.item?.postId &&
                                      value?.chosenSize == item?.chosenSize &&
                                      value?.chosenColor == item?.chosenColor
                                  )!?.chosenAmount + 1,
                              },
                              ...(context?.cartItems || []).slice(
                                (context?.cartItems || [])?.findIndex(
                                  (value) =>
                                    value?.item?.postId == item?.item?.postId &&
                                    value?.chosenSize == item?.chosenSize &&
                                    value?.chosenColor == item?.chosenColor
                                ) + 1
                              ),
                            ]);
                          }}
                        >
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                            layout="fill"
                            draggable={false}
                          />
                        </div>
                        <div
                          className="relative w-5 h-5 flex items-center justify-center rotate-90 cursor-pointer active:scale-95"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            if (purchaseMode === "appMarket") {
                              const existing = (
                                context?.cartItemsMarket || []
                              )?.findIndex(
                                (value) =>
                                  value?.item?.metadata?.id ===
                                    item?.item?.metadata?.id &&
                                  value?.item?.chosenSize ===
                                    item?.item?.chosenSize
                              );

                              const newCart =
                                (context?.cartItemsMarket || [])?.[existing]
                                  ?.chosenAmount > 1
                                  ? [
                                      ...(context?.cartItemsMarket || []).slice(
                                        0,
                                        existing
                                      ),
                                      {
                                        ...(context?.cartItemsMarket || [])?.[
                                          existing
                                        ],
                                        chosenAmount:
                                          (context?.cartItemsMarket || [])?.[
                                            existing
                                          ]?.chosenAmount - 1,
                                      },
                                      ...(context?.cartItemsMarket || []).slice(
                                        existing + 1
                                      ),
                                    ]
                                  : [
                                      ...(context?.cartItemsMarket || []).slice(
                                        0,
                                        existing
                                      ),
                                      ...(context?.cartItemsMarket || []).slice(
                                        existing + 1
                                      ),
                                    ];

                              if (
                                newCart?.length !==
                                (context?.cartItemsMarket || [])?.length
                              ) {
                                setCartItem((prev) => ({
                                  ...prev,
                                  market: newCart[0],
                                }));
                              }
                              context?.setCartItemsMarket(newCart);
                              return;
                            }

                            const newCart =
                              (context?.cartItems || [])?.find(
                                (value) =>
                                  value?.item?.postId == item?.item?.postId &&
                                  value?.chosenSize == item?.chosenSize &&
                                  value?.chosenColor == item?.chosenColor
                              )!?.chosenAmount > 1
                                ? [
                                    ...(context?.cartItems || []).slice(
                                      0,
                                      (context?.cartItems || [])?.findIndex(
                                        (value) =>
                                          value?.item?.postId ==
                                            item?.item?.postId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      )
                                    ),
                                    {
                                      ...(context?.cartItems || [])?.find(
                                        (value) =>
                                          value?.item?.postId ==
                                            item?.item?.postId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      ),
                                      chosenAmount:
                                        (context?.cartItems || [])?.find(
                                          (value) =>
                                            value?.item?.postId ==
                                              item?.item?.postId &&
                                            value?.chosenSize ==
                                              item?.chosenSize &&
                                            value?.chosenColor ==
                                              item?.chosenColor
                                        )!?.chosenAmount - 1,
                                    },
                                    ...(context?.cartItems || []).slice(
                                      (context?.cartItems || [])?.findIndex(
                                        (value) =>
                                          value?.item?.postId ==
                                            item?.item?.postId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      ) + 1
                                    ),
                                  ]
                                : [
                                    ...(context?.cartItems || []).slice(
                                      0,
                                      (context?.cartItems || [])?.findIndex(
                                        (value) =>
                                          value?.item?.postId ==
                                            item?.item?.postId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      )
                                    ),
                                    ...(context?.cartItems || []).slice(
                                      (context?.cartItems || [])?.findIndex(
                                        (value) =>
                                          value?.item?.postId ==
                                            item?.item?.postId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      ) + 1
                                    ),
                                  ];

                            if (
                              newCart?.length !==
                              (context?.cartItems || [])?.length
                            ) {
                              setCartItem((prev) => ({
                                ...prev,
                                prerolls: newCart[0] as CartItem,
                              }));
                            }
                            context?.setCartItems(newCart as CartItem[]);
                          }}
                        >
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                            layout="fill"
                            draggable={false}
                          />
                        </div>
                      </div>
                      <div
                        className="ml-auto justify-end items-center w-fit h-fit flex cursor-pointer active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (purchaseMode === "appMarket") {
                            const existingIndex = (
                              context?.cartItemsMarket || []
                            )?.findIndex(
                              (value) =>
                                value?.item?.metadata?.id ===
                                  item?.item?.metadata?.id &&
                                value?.item?.chosenSize ===
                                  item?.item?.chosenSize
                            );

                            if (existingIndex === -1) return;

                            const newCart = [
                              ...(context?.cartItemsMarket || []).slice(
                                0,
                                existingIndex
                              ),
                              ...(context?.cartItemsMarket || []).slice(
                                existingIndex + 1
                              ),
                            ];

                            if (newCart?.length > 0) {
                              setCartItem((prev) => ({
                                ...prev,
                                market: newCart[0],
                              }));
                            } else {
                              setCartItem((prev) => ({
                                ...prev,
                                market: undefined,
                              }));
                            }
                            context?.setCartItemsMarket(newCart);
                            return;
                          }

                          const newCart = lodash.concat(
                            lodash.slice(
                              [...(context?.cartItems || [])],
                              0,
                              (context?.cartItems || [])?.findIndex(
                                (value) =>
                                  value?.item?.postId == item?.item?.postId &&
                                  value?.chosenSize == item?.chosenSize &&
                                  value?.chosenColor == item?.chosenColor
                              )
                            ),
                            lodash.slice(
                              [...(context?.cartItems || [])],
                              (context?.cartItems || [])?.findIndex(
                                (value) =>
                                  value?.item?.postId == item?.item?.postId &&
                                  value?.chosenSize == item?.chosenSize &&
                                  value?.chosenColor == item?.chosenColor
                              ) + 1
                            )
                          );

                          if (
                            newCart?.length !==
                            (context?.cartItems || [])?.length
                          ) {
                            setCartItem((prev) => ({
                              ...prev,
                              prerolls: newCart[0],
                            }));
                          }
                          context?.setCartItems(newCart);
                        }}
                      >
                        <ImCross color="white" size={10} />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Items;
