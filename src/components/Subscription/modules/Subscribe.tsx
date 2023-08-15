import { FunctionComponent } from "react";
import { setLogin } from "../../../../redux/reducers/loginSlice";
import { CardElement } from "@stripe/react-stripe-js";
import useSubscription from "../hooks/useSubscription";
import { AiOutlineLoading } from "react-icons/ai";
import { SubscribeProps } from "../types/subscription.types";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const Subscribe: FunctionComponent<SubscribeProps> = ({
  dispatch,
  connectedPKP,
}): JSX.Element => {
  const { subscriptionAddLoading, handleCreateSubscription } =
    useSubscription();
  return (
    <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-center">
      <CardElement
        options={CARD_ELEMENT_OPTIONS}
        className="relative w-1/2 h-10 border p-2"
      />
      <div
        className={`relative w-1/2 h-12 rounded-md border border-white bg-azul text-white font-mana items-center justify-center flex ${
          !subscriptionAddLoading
            ? "cursor-pointer active:scale-95"
            : "opacity-70"
        }`}
        onClick={
          !subscriptionAddLoading
            ? !connectedPKP
              ? () =>
                  dispatch(
                    setLogin({
                      actionOpen: true,
                      actionHighlight: "fiat",
                    })
                  )
              : () => handleCreateSubscription()
            : () => {}
        }
      >
        <div
          className={`relative w-fit h-fit flex justify-center items-center ${
            subscriptionAddLoading && "animate-spin"
          }`}
        >
          {subscriptionAddLoading ? (
            <AiOutlineLoading size={15} color={"white"} />
          ) : !connectedPKP ? (
            "CONNECT"
          ) : (
            "SUBSCRIBE"
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
