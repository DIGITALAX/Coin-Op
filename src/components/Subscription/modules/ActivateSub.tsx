import { FunctionComponent } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { APPEARANCE } from "../../../../lib/constants";
import Subscribe from "./Subscribe";
import { setSubscriptionInfo } from "../../../../redux/reducers/subscriptionInfoSlice";
import { ActivateSub } from "../types/subscription.types";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const ActivateSub: FunctionComponent<ActivateSub> = ({
  dispatch,
  connectedPKP,
  subscriptionInfo,
}): JSX.Element => {
  const options = {
    clientSecret: undefined,
    appearance: APPEARANCE,
  };
  return (
    <div className="relative w-full h-fit flex flex-col items-center justify-center">
      <Elements stripe={stripePromise} options={options}>
        <div className="relative w-full h-fit inline-flex flex-wrap gap-3 items-center justify-center">
          <div className="relative w-1/2 h-fit flex flex-row items-center justify-center gap-3">
            <input
              className="relative bg-black border border-white w-full h-10 p-1 font-sat text-white items-center justify-center"
              onChange={(e) => dispatch(setSubscriptionInfo(e.target.value))}
              placeholder={
                subscriptionInfo?.email?.trim() !== ""
                  ? subscriptionInfo?.email
                  : "Email"
              }
              value={subscriptionInfo?.email}
            />
          </div>
          <Subscribe
            dispatch={dispatch}
            connectedPKP={connectedPKP?.ethAddress}
          />
        </div>
      </Elements>
    </div>
  );
};

export default ActivateSub;
