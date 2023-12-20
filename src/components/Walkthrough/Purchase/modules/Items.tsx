import { FunctionComponent } from "react";
import { ItemsProps } from "../types/synth.types";
import { CartItem } from "@/components/Common/types/common.types";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "../../../../../lib/constants";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import lodash from "lodash";
import { setModalOpen } from "../../../../../redux/reducers/modalOpenSlice";

const Items: FunctionComponent<ItemsProps> = ({
  cartItems,
  cartItem,
  dispatch,
  checkoutCurrency,
  setCartItem,
  oracleValue,
  setEncrypted,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 h-[12rem] flex">
      <div className="relative border border-ligero rounded-md w-full h-full flex flex-col gap-3 p-2">
        <div className="relative w-full h-full items-start justify-start flex overflow-scroll">
          <div className="flex flex-col gap-2 items-start justify-start w-fit preG:w-full h-fit">
            {cartItems?.length < 1 ? (
              <div className="relative w-full h-full font-mana text-white text-xs flex items-center justify-center text-center">
                fill up your cart
              </div>
            ) : (
              [...cartItems]
                ?.sort((a, b) => {
                  return a.item.collectionMetadata.title.localeCompare(
                    b.item.collectionMetadata.title
                  );
                })
                ?.map((item: CartItem, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`relative w-full h-fit sm:h-12 flex sm:flex-nowrap flex-wrap flex-row gap-3 sm:gap-5 font-mana text-white text-xs justify-start sm:justify-between items-center sm:py-0 py-1.5 px-1.5 cursor-pointer ${
                        item?.item?.collectionMetadata?.title ===
                          cartItem?.item?.collectionMetadata?.title &&
                        "bg-ama/20 rounded-md"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCartItem(item);
                      }}
                    >
                      <div className="relative w-10 h-10 rounded-lg bg-cross flex items-center justify-center">
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            item?.item?.collectionMetadata?.images?.[0]?.split(
                              "ipfs://"
                            )[1]
                          }`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                          draggable={false}
                        />
                      </div>
                      <div
                        className="relative w-4 h-4 border border-ligero flex justify-start items-center rounded-full"
                        style={{ backgroundColor: item.chosenColor }}
                      ></div>
                      <div className="relative w-fit h-fit flex justify-start items-center uppercase break-all">
                        {item.chosenSize
                          ?.replaceAll('(24" x 36")', "")
                          ?.replaceAll('(18" x 24")', "")
                          ?.replaceAll('(11" x 17")', "")
                          ?.replaceAll('(4" x 4")', "")
                          ?.replaceAll('(2" x 2")', "")
                          ?.replaceAll('(3" x 3")', "")}
                      </div>
                      <div className="relative w-fit h-fit text-ama flex whitespace-nowrap">
                        {
                          ACCEPTED_TOKENS.find(
                            (subArray) => subArray[2] === checkoutCurrency
                          )?.[1]
                        }{" "}
                        {(
                          (Number(item?.item?.prices?.[item?.chosenIndex!]) *
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
                      <div className="relative w-fit h-fit text-ama flex">
                        {item.chosenAmount}
                      </div>
                      <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                        <div
                          className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setEncrypted(undefined);
                            if (
                              cartItems
                                ?.filter(
                                  (item) =>
                                    item?.item?.pubId ==
                                    cartItems?.find(
                                      (value) =>
                                        value?.item?.pubId ==
                                          item?.item?.pubId &&
                                        value?.chosenSize == item?.chosenSize &&
                                        value?.chosenColor == item?.chosenColor
                                    )?.item?.pubId
                                )
                                ?.reduce(
                                  (accumulator, currentItem) =>
                                    accumulator + currentItem.chosenAmount,
                                  0
                                ) +
                                1 >
                                Number(
                                  cartItems?.find(
                                    (value) =>
                                      value?.item?.pubId == item?.item?.pubId &&
                                      value?.chosenSize == item?.chosenSize &&
                                      value?.chosenColor == item?.chosenColor
                                  )?.item?.amount
                                ) ||
                              Number(
                                cartItems?.find(
                                  (value) =>
                                    value?.item?.pubId == item?.item?.pubId &&
                                    value?.chosenSize == item?.chosenSize &&
                                    value?.chosenColor == item?.chosenColor
                                )?.item?.amount
                              ) ==
                                Number(
                                  cartItems?.find(
                                    (value) =>
                                      value?.item?.pubId == item?.item?.pubId &&
                                      value?.chosenSize == item?.chosenSize &&
                                      value?.chosenColor == item?.chosenColor
                                  )?.item?.soldTokens
                                )
                            ) {
                              dispatch(
                                setModalOpen({
                                  actionOpen: true,
                                  actionMessage:
                                    "We know you're eager, but you've reached this prints' collect limit!",
                                })
                              );
                              return;
                            }

                            dispatch(
                              setCart([
                                ...cartItems.slice(
                                  0,
                                  cartItems?.findIndex(
                                    (value) =>
                                      value?.item?.pubId == item?.item?.pubId &&
                                      value?.chosenSize == item?.chosenSize &&
                                      value?.chosenColor == item?.chosenColor
                                  )
                                ),
                                {
                                  ...cartItems?.find(
                                    (value) =>
                                      value?.item?.pubId == item?.item?.pubId &&
                                      value?.chosenSize == item?.chosenSize &&
                                      value?.chosenColor == item?.chosenColor
                                  )!,
                                  chosenAmount:
                                    cartItems?.find(
                                      (value) =>
                                        value?.item?.pubId ==
                                          item?.item?.pubId &&
                                        value?.chosenSize == item?.chosenSize &&
                                        value?.chosenColor == item?.chosenColor
                                    )!?.chosenAmount + 1,
                                },
                                ...cartItems.slice(
                                  cartItems?.findIndex(
                                    (value) =>
                                      value?.item?.pubId == item?.item?.pubId &&
                                      value?.chosenSize == item?.chosenSize &&
                                      value?.chosenColor == item?.chosenColor
                                  ) + 1
                                ),
                              ])
                            );
                          }}
                        >
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                            layout="fill"
                            draggable={false}
                          />
                        </div>
                        <div
                          className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setEncrypted(undefined);
                            const newCart =
                              cartItems?.find(
                                (value) =>
                                  value?.item?.pubId == item?.item?.pubId &&
                                  value?.chosenSize == item?.chosenSize &&
                                  value?.chosenColor == item?.chosenColor
                              )!?.chosenAmount > 1
                                ? [
                                    ...cartItems.slice(
                                      0,
                                      cartItems?.findIndex(
                                        (value) =>
                                          value?.item?.pubId ==
                                            item?.item?.pubId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      )
                                    ),
                                    {
                                      ...cartItems?.find(
                                        (value) =>
                                          value?.item?.pubId ==
                                            item?.item?.pubId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      ),
                                      chosenAmount:
                                        cartItems?.find(
                                          (value) =>
                                            value?.item?.pubId ==
                                              item?.item?.pubId &&
                                            value?.chosenSize ==
                                              item?.chosenSize &&
                                            value?.chosenColor ==
                                              item?.chosenColor
                                        )!?.chosenAmount - 1,
                                    },
                                    ...cartItems.slice(
                                      cartItems?.findIndex(
                                        (value) =>
                                          value?.item?.pubId ==
                                            item?.item?.pubId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      ) + 1
                                    ),
                                  ]
                                : [
                                    ...cartItems.slice(
                                      0,
                                      cartItems?.findIndex(
                                        (value) =>
                                          value?.item?.pubId ==
                                            item?.item?.pubId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      )
                                    ),
                                    ...cartItems.slice(
                                      cartItems?.findIndex(
                                        (value) =>
                                          value?.item?.pubId ==
                                            item?.item?.pubId &&
                                          value?.chosenSize ==
                                            item?.chosenSize &&
                                          value?.chosenColor ==
                                            item?.chosenColor
                                      ) + 1
                                    ),
                                  ];

                            if (newCart?.length !== cartItems?.length) {
                              setCartItem(newCart[0] as CartItem);
                            }
                            dispatch(setCart(newCart as CartItem[]));
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
                          const newCart = lodash.concat(
                            lodash.slice(
                              [...cartItems],
                              0,
                              cartItems?.findIndex(
                                (value) =>
                                  value?.item?.pubId == item?.item?.pubId &&
                                  value?.chosenSize == item?.chosenSize &&
                                  value?.chosenColor == item?.chosenColor
                              )
                            ),
                            lodash.slice(
                              [...cartItems],
                              cartItems?.findIndex(
                                (value) =>
                                  value?.item?.pubId == item?.item?.pubId &&
                                  value?.chosenSize == item?.chosenSize &&
                                  value?.chosenColor == item?.chosenColor
                              ) + 1
                            )
                          );

                          if (newCart?.length !== cartItems?.length) {
                            setCartItem(newCart[0]);
                          }

                          dispatch(setCart(newCart));
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
