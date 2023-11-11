import { FunctionComponent } from "react";
import Grid from "./Grid";
import { PurchaseProps } from "../types/synth.types";
import useStripe from "../hooks/useStripe";
import { Elements } from "@stripe/react-stripe-js";
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
  client,
  publicClient,
  clientSecret,
  fulfillmentDetails,
  connectedPKP,
  encryptedInformation,
  paymentType,
}): JSX.Element => {
  const { options } = useStripe(
    dispatch,
    cartItems,
    connectedPKP,
    encryptedInformation,
    clientSecret
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
            connectedPKP={connectedPKP?.pkpWallet}
            chain={chain}
            openChainModal={openChainModal}
            client={client}
            publicClient={publicClient}
            encryptedInformation={encryptedInformation}
            paymentType={paymentType}
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
          connectedPKP={connectedPKP?.pkpWallet}
          chain={chain}
          openChainModal={openChainModal}
          publicClient={publicClient}
          client={client}
          encryptedInformation={encryptedInformation}
          paymentType={paymentType}
        />
      )}
    </div>
  );
};

export default Purchase;
