import { FunctionComponent } from "react";
import { FiatProps } from "../types/synth.types";
import { AiOutlineLoading } from "react-icons/ai";
import { PaymentElement } from "@stripe/react-stripe-js";
import { setLogin } from "../../../../../redux/reducers/loginSlice";

const Fiat: FunctionComponent<FiatProps> = ({
  handleCheckoutFiat,
  fiatCheckoutLoading,
  cartItems,
  encryptFulfillerInformation,
  encryptedInformation,
  connectedPKP,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 h-fit flex flex-col gap-5 pt-4">
      {encryptedInformation && (
        <div className="relative w-full h-fit flex">
          <PaymentElement
            id="payment-element"
            className="relative w-full h-fit flex flex-col"
          />
        </div>
      )}
      <div
        className={`relative w-full h-12 rounded-md border border-white bg-azul text-white font-mana items-center justify-center flex ${
          !fiatCheckoutLoading ? "cursor-pointer active:scale-95" : "opacity-70"
        }`}
        onClick={
          !fiatCheckoutLoading && !connectedPKP
            ? () =>
                dispatch(
                  setLogin({
                    actionOpen: true,
                    actionHighlight: "fiat",
                  })
                )
            : !fiatCheckoutLoading && !encryptedInformation
            ? () => encryptFulfillerInformation()
            : () =>
                !fiatCheckoutLoading &&
                cartItems?.length > 0 &&
                handleCheckoutFiat()
        }
      >
        <div
          className={`relative w-fit h-fit flex justify-center items-center ${
            fiatCheckoutLoading && "animate-spin"
          }`}
        >
          {fiatCheckoutLoading ? (
            <AiOutlineLoading size={15} color={"white"} />
          ) : !connectedPKP ? (
            "CONNECT"
          ) : !encryptedInformation ? (
            "SET ORDER INFO"
          ) : (
            "CHECKOUT"
          )}
        </div>
      </div>
    </div>
  );
};

export default Fiat;
