import { FunctionComponent } from "react";
import Grid from "./Grid";
import { PurchaseProps } from "../types/synth.types";
import useStripe from "../hooks/useStripe";
import { Elements } from "@stripe/react-stripe-js";
import { RootState } from "../../../../../redux/store";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import PlainGrid from "./PlainGrid";

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
  chain,
  openChainModal,
}): JSX.Element => {
  const { options } = useStripe();
  const clientSecret = useSelector(
    (state: RootState) => state.app.clientSecretReducer.value
  );
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const connectedPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value?.pkpWallet
  );
  return (
    <div className="relative w-full h-fit flex flex-col">
      {clientSecret && cartItems?.length > 0 ? (
        <Elements key={clientSecret} stripe={stripePromise} options={options}>
          <Grid
            dispatch={dispatch}
            scrollRef={scrollRef}
            cartItems={cartItems}
            address={address}
            openConnectModal={openConnectModal}
            signInLoading={signInLoading}
            fulfillmentDetails={fulfillmentDetails}
            connectedPKP={connectedPKP}
            chain={chain}
            openChainModal={openChainModal}
          />
        </Elements>
      ) : (
        <PlainGrid
          dispatch={dispatch}
          scrollRef={scrollRef}
          cartItems={cartItems}
          address={address}
          openConnectModal={openConnectModal}
          signInLoading={signInLoading}
          fulfillmentDetails={fulfillmentDetails}
          connectedPKP={connectedPKP}
          chain={chain}
          openChainModal={openChainModal}
        />
      )}
    </div>
  );
};

export default Purchase;
