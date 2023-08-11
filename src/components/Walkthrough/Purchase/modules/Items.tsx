import { FunctionComponent } from "react";
import { ItemsProps } from "../types/synth.types";
import { CartItem } from "@/components/Common/types/common.types";
import {
  ACCEPTED_TOKENS,
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../../lib/constants";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import lodash from "lodash";

const Items: FunctionComponent<ItemsProps> = ({
  cartItems,
  cartItem,
  paymentType,
  dispatch,
  checkoutCurrency,
  setCartItem,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 h-40 flex">
      <div className="relative border border-ligero rounded-md w-full h-full flex flex-col gap-3 p-2">
        <div className="relative w-full h-full items-start justify-start flex overflow-scroll">
          <div className="flex flex-col gap-2 items-start justify-start w-fit preG:w-full h-fit">
            {cartItems?.length < 1 ? (
              <div className="relative w-full h-full font-mana text-white text-xs flex items-center justify-center text-center">
                fill up your cart
              </div>
            ) : (
              cartItems?.map((item: CartItem, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative w-full h-12 flex flex-row gap-5 font-mana text-white text-xs justify-between items-center px-1.5 ${
                      JSON.stringify({ ...item, amount: undefined }) ===
                        JSON.stringify({ ...cartItem, amount: undefined }) &&
                      "bg-ama/20 rounded-md"
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-lg bg-cross flex items-center justify-center">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          item?.uri?.image?.split("ipfs://")[1]
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
                    <div className="relative w-fit h-fit flex justify-start items-center uppercase">
                      {item.chosenSize}
                    </div>
                    <div className="relative w-fit h-fit text-ama flex whitespace-nowrap">
                      {paymentType === "crypto"
                        ? ACCEPTED_TOKENS.find(
                            (subArray) => subArray[1] === checkoutCurrency
                          )?.[1]
                        : "$"}{" "}
                      {item.price / 10 ** 18}
                    </div>
                    <div className="relative w-fit h-fit text-ama flex">
                      {item.amount}
                    </div>
                    <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                      <div
                        className="relative w-5 h-5 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                        onClick={() => {
                          dispatch(
                            setCart([
                              ...cartItems.slice(0, index),
                              {
                                ...cartItems[index],
                                amount: cartItems[index].amount + 1,
                              },
                              ...cartItems.slice(index + 1),
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
                        onClick={() => {
                          const newCart =
                            cartItems[index].amount > 1
                              ? [
                                  ...cartItems.slice(0, index),
                                  {
                                    ...cartItems[index],
                                    amount: cartItems[index].amount - 1,
                                  },
                                  ...cartItems.slice(index + 1),
                                ]
                              : [
                                  ...cartItems.slice(0, index),
                                  ...cartItems.slice(index + 1),
                                ];
                          dispatch(setCart(newCart));
                          setCartItem(newCart[0]);
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
                      onClick={() => {
                        const newCart = lodash.concat(
                          lodash.slice([...cartItems], 0, index),
                          lodash.slice([...cartItems], index + 1)
                        );
                        dispatch(setCart(newCart));
                        setCartItem(newCart[0]);
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
