import { Appearance, StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";

const appearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#76b3f4",
    colorBackground: "#000000",
    fontFamily: "Manaspace",
  },
};

const useStripe = () => {
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const [clientSecret, setClientSecret] = useState<string | undefined>();

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  const createPayment = async (): Promise<void> => {
    try {
      const amount =
        cartItems.length > 0
          ? cartItems?.reduce(
              (accumulator, currentItem) =>
                accumulator +
                (currentItem.price * currentItem.amount) / 10 ** 18,
              0
            )
          : 50;
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
        }),
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      return data.clientSecret;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    createPayment();
  }, [cartItems]);

  return {
    clientSecret,
    options,
  };
};

export default useStripe;
