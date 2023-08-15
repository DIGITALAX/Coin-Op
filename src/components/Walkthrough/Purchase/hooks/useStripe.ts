import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { setClientSecret } from "../../../../../redux/reducers/clientSecretSlice";
import { APPEARANCE } from "../../../../../lib/constants";
import { chunkString } from "../../../../../lib/subgraph/helpers/chunkString";

const useStripe = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const currentPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );
  const encryptedInformationReducer = useSelector(
    (state: RootState) => state.app.encryptedInformationReducer
  );
  const clientSecret = useSelector(
    (state: RootState) => state.app.clientSecretReducer.value
  );
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
      if (
        encryptedInformationReducer.information &&
        encryptedInformationReducer.information.length
      ) {
        const flattenedString =
          encryptedInformationReducer.information.join("");

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
  }, [cartItems, encryptedInformationReducer.information]);

  return {
    options,
  };
};

export default useStripe;
