import { useEffect } from "react";
import { setClientSecret } from "../../../../../redux/reducers/clientSecretSlice";
import { APPEARANCE } from "../../../../../lib/constants";
import { chunkString } from "../../../../../lib/subgraph/helpers/chunkString";
import { AnyAction, Dispatch } from "redux";
import { CartItem } from "@/components/Common/types/common.types";
import { PKPSig } from "../../../../../redux/reducers/currentPKPSlice";

const useStripe = (
  dispatch: Dispatch<AnyAction>,
  cartItems: CartItem[],
  currentPKP: PKPSig | undefined,
  encryptedInformation: string[] | undefined,
  clientSecret: string | undefined
) => {
  const options = {
    clientSecret,
    appearance: APPEARANCE,
  };

  const createPayment = async (): Promise<void> => {
    try {
      const amount = cartItems?.reduce(
        (accumulator, currentItem) =>
          accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
        0
      );
      let metadataChunks: { [key: string]: string } = {};
      if (encryptedInformation && encryptedInformation.length) {
        const flattenedString = encryptedInformation.join("");

        const chunks = chunkString(flattenedString, 490);

        chunks.forEach((chunk, index) => {
          metadataChunks[`part_${index + 1}`] = chunk;
        });
      }

      let tokenIdChunks: { [key: string]: string } = {};
      if (currentPKP?.encryptedToken) {
        const chunks = chunkString(currentPKP?.encryptedToken, 490);

        chunks.forEach((chunk, index) => {
          tokenIdChunks[`part_${index + 1}`] = chunk;
        });
      }

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount * 100,
          encryptedInformation: metadataChunks,
          encryptedTokenId: tokenIdChunks,
        }),
      });
      const data = await response.json();
      dispatch(setClientSecret(data.clientSecret));
      return data.clientSecret;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      createPayment();
    }
  }, [cartItems, encryptedInformation]);

  return {
    options,
  };
};

export default useStripe;
