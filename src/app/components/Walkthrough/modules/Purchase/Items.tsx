import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import lodash from "lodash";
import { ModalContext } from "@/app/providers";
import { usePathname } from "next/navigation";
import { CartItem } from "@/app/components/Prerolls/types/prerolls.types";
import { ASSETS, INFURA_GATEWAY } from "@/app/lib/constants";
import { ItemsProps } from "../../types/walkthrough.types";

const Items: FunctionComponent<ItemsProps> = ({
  cartItem,
  checkoutCurrency,
  setCartItem,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();

  return (
    <div className="relative w-full h-[12rem] flex">
      <div className="relative border border-ligero rounded-md w-full h-full flex flex-col gap-3 p-2">
        <div className="relative w-full h-full items-start justify-start flex overflow-scroll">
          <div className="flex flex-col gap-2 items-start justify-start w-fit preG:w-full h-fit">
            {Number(context?.cartItems?.length) < 1 ? (
              <div
                className={`relative w-full h-full text-white text-xs flex items-center justify-center text-center ${
                  path?.includes("/es/") ? "font-bit" : "font-mana"
                }`}
              >
                {dict?.Common?.fill}
              </div>
            ) : (
              [...(context?.cartItems || [])]
                ?.sort((a, b) => {
                  return a.item.metadata.title.localeCompare(
                    b.item.metadata.title
                  );
                })
                ?.map((item: CartItem, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`relative w-full h-fit sm:h-12 flex sm:flex-nowrap flex-wrap flex-row gap-3 sm:gap-5 font-mana text-white text-xs justify-start sm:justify-between items-center sm:py-0 py-1.5 px-1.5 cursor-pointer ${
                        item?.item?.metadata?.title ===
                          cartItem?.item?.metadata?.title &&
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
                            item?.item?.metadata?.images?.[0]?.split(
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
                          className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
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
                              setCartItem(newCart[0] as CartItem);
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
                            setCartItem(newCart[0]);
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
