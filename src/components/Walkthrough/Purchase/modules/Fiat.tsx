import { FunctionComponent } from "react";
import { FiatProps } from "../types/synth.types";
import { AiOutlineLoading } from "react-icons/ai";

const Fiat: FunctionComponent<FiatProps> = ({
  handleCheckoutFiat,
  fiatCheckoutLoading,
}): JSX.Element => {
  return (
    <div
      className="relative w-3/4 h-12 rounded-md border border-white bg-azul text-white font-mana items-center justify-center flex cursor-pointer active:scale-95"
      onClick={() => !fiatCheckoutLoading && handleCheckoutFiat()}
    >
      <div
        className={`relative w-fit h-fit flex justify-center items-center ${
          fiatCheckoutLoading && "animate-spin"
        }`}
      >
        {fiatCheckoutLoading ? (
          <AiOutlineLoading size={15} color={"white"} />
        ) : (
          "CHECKOUT"
        )}
      </div>
    </div>
  );
};

export default Fiat;
