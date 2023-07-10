import { FunctionComponent } from "react";
import { CryptoProps } from "../types/synth.types";
import { AiOutlineLoading } from "react-icons/ai";

const Crypto: FunctionComponent<CryptoProps> = ({
  openConnectModal,
  address,
  signInLoading,
  handleCheckoutCrypto,
  cryptoCheckoutLoading,
  approved,
  handleApproveSpend,
}): JSX.Element => {
  return (
    <div
      className="relative w-3/4 h-12 rounded-md border border-white bg-azul text-white font-mana items-center justify-center flex cursor-pointer active:scale-95"
      onClick={
        !signInLoading && !address && !cryptoCheckoutLoading
          ? openConnectModal
          : approved
          ? () =>
              !signInLoading && !cryptoCheckoutLoading && handleCheckoutCrypto()
          : () =>
              !signInLoading && !cryptoCheckoutLoading && handleApproveSpend()
      }
    >
      <div
        className={`relative w-fit h-fit flex justify-center items-center ${
          (signInLoading || cryptoCheckoutLoading) && "animate-spin"
        }`}
      >
        {signInLoading || cryptoCheckoutLoading ? (
          <AiOutlineLoading size={15} color={"white"} />
        ) : !address ? (
          "CONNECT"
        ) : !approved ? (
          "APPROVE SPEND"
        ) : (
          "CHECKOUT"
        )}
      </div>
    </div>
  );
};

export default Crypto;
