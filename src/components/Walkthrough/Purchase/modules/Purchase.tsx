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
  client,
  publicClient,
}): JSX.Element => {
  const clientSecret = useSelector(
    (state: RootState) => state.app.clientSecretReducer.value
  );
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const connectedPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );
  const encryptedInformation = useSelector(
    (state: RootState) => state.app.encryptedInformationReducer.information
  );
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
        />
      )}
    </div>
  );
};

export default Purchase;
