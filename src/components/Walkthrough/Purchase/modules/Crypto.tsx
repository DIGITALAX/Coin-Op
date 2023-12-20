import { FunctionComponent } from "react";
import { CryptoProps } from "../types/synth.types";
import { AiOutlineLoading } from "react-icons/ai";

const Crypto: FunctionComponent<CryptoProps> = ({
  address,
  signInLoading,
  handleCheckoutCrypto,
  cryptoCheckoutLoading,
  approved,
  handleApproveSpend,
  cartItems,
  chain,
  openChainModal,
  openConnectModal,
  encryptFulfillment,
  encrypted,
  lensConnected,
  handleLensSignIn,
}): JSX.Element => {
  return (
    <div
      className={`relative w-3/4 h-12 rounded-md border border-white bg-azul text-white font-mana items-center justify-center flex  ${
        !signInLoading && !cryptoCheckoutLoading
          ? "cursor-pointer active:scale-95"
          : "opacity-70"
      } `}
      onClick={
        !signInLoading && !cryptoCheckoutLoading
          ? !address
            ? openConnectModal
            : chain !== 137
            ? openChainModal
            : !lensConnected?.id
            ? () => handleLensSignIn()
            : !encrypted
            ? () => cartItems?.length > 0 && encryptFulfillment()
            : !approved
            ? () => cartItems?.length > 0 && handleApproveSpend!()
            : () => cartItems?.length > 0 && handleCheckoutCrypto!()
          : () => {}
      }
    >
      <div
        className={`relative w-fit h-fit flex justify-center items-center ${
          (signInLoading || cryptoCheckoutLoading) && "animate-spin"
        }`}
      >
        {signInLoading || cryptoCheckoutLoading ? (
          <AiOutlineLoading size={15} color={"white"} />
        ) : cartItems.length < 1 ? (
          "ADD TO CART"
        ) : !address ? (
          "CONNECT"
        ) : !lensConnected?.id ? (
          "LENS"
        ) : !encrypted ? (
          "ENCRYPT DETAILS"
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
