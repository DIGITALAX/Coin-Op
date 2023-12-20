import { ethers } from "ethers";
import { CartItem } from "@/components/Common/types/common.types";
import { UnknownOpenActionModuleInput } from "@/components/Common/types/generated";
import { COIN_OP_OPEN_ACTION } from "../../constants";

const encodeActData = (
  cartItem: CartItem,
  cartItems: CartItem[],
  encryptedFulfillment: string,
  currency: `0x${string}`
): UnknownOpenActionModuleInput | undefined => {
  const coder = new ethers.AbiCoder();

  return {
    address: COIN_OP_OPEN_ACTION,
    data: coder.encode(
      ["uint256[]", "uint256[]", "string", "address", "bool"],
      [
        cartItem?.item?.printType !== "0" && cartItem?.item?.printType! == "1"
          ? Array.from(
              {
                length: cartItems?.filter(
                  (cart) =>
                    cart?.item?.collectionMetadata?.title ==
                    cartItem?.item?.collectionMetadata?.title
                )?.length!,
              },
              () => 0
            )
          : cartItems
              ?.filter(
                (cart) =>
                  cart?.item?.collectionMetadata?.title ==
                  cartItem?.item?.collectionMetadata?.title
              )
              ?.map((item) => item?.chosenIndex),
        cartItems
          ?.filter(
            (cart) =>
              cart?.item?.collectionMetadata?.title ==
              cartItem?.item?.collectionMetadata?.title
          )
          ?.map((item) => item?.chosenAmount),
        encryptedFulfillment,
        currency,
        false,
      ]
    ),
  };
};

export default encodeActData;
