import { FunctionComponent } from "react";
import Grid from "./Grid";
import { PurchaseProps } from "../types/synth.types";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useStripe from "../hooks/useStripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const Purchase: FunctionComponent<PurchaseProps> = ({
  dispatch,
  scrollRef,
  cartItems,
  signInLoading,
  address,
  openConnectModal,
}): JSX.Element => {
  const { options, clientSecret } = useStripe();
  return (
    <div className="relative w-full h-fit flex flex-col">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <Grid
            dispatch={dispatch}
            scrollRef={scrollRef}
            cartItems={cartItems}
            address={address}
            openConnectModal={openConnectModal}
            signInLoading={signInLoading}
          />
        </Elements>
      )}
    </div>
  );
};

export default Purchase;
