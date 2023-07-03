import { FunctionComponent } from "react";
import { CheckoutProps } from "../types/synth.types";
import Fiat from "./Fiat";
import Crypto from "./Crypto";

const Checkout: FunctionComponent<CheckoutProps> = ({
  openConnectModal,
  handleLensSignIn,
  address,
  profile,
  signInLoading,
  paymentType,
  setPaymentType,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 h-full flex flex-col items-center justify-start gap-4">
      <div className="relative w-1/2 justify-center flex flex-row font-mana text-white text-2xl uppercase">
        <div
          className={`relative bg-azul flex items-center justify-center bg-azul rounded-sm border border-y-white border-r-white px-2 py-1.5 w-36 h-fit hover:opacity-70 cursor-pointer ${
            paymentType === "fiat" ? "bg-oscurazul" : "bg-azul"
          }`}
          onClick={() => setPaymentType("fiat")}
        >
          fiat
        </div>
        <div
          className={`relative rounded-sm px-2 py-1.5 bg-azul flex items-center justify-center border border-white w-36 h-fit hover:opacity-70 cursor-pointer ${
            paymentType === "crypto" ? "bg-oscurazul" : "bg-azul"
          }`}
          onClick={() => setPaymentType("crypto")}
        >
          crypto
        </div>
      </div>
      {paymentType === "crypto" ? (
        <Crypto
          address={address}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          profile={profile}
          signInLoading={signInLoading}
        />
      ) : (
        <Fiat />
      )}
    </div>
  );
};

export default Checkout;
