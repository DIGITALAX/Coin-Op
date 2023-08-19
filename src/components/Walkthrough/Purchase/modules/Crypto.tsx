import { FunctionComponent } from "react";
import { CryptoProps } from "../types/synth.types";
import { AiOutlineLoading } from "react-icons/ai";
import { setLogin } from "../../../../../redux/reducers/loginSlice";

const Crypto: FunctionComponent<CryptoProps> = ({
  address,
  signInLoading,
  handleCheckoutCrypto,
  cryptoCheckoutLoading,
  approved,
  handleApproveSpend,
  cartItems,
  dispatch,
  connectedPKP,
  chain,
  openChainModal,
}): JSX.Element => {
  return (
    <div
      className={`relative w-3/4 h-12 rounded-md border border-white bg-azul text-white font-mana items-center justify-center flex  ${
        !signInLoading && !cryptoCheckoutLoading
          ? "cursor-pointer active:scale-95"
          : "opacity-70"
      } `}
      onClick={
        !signInLoading &&
        !cryptoCheckoutLoading &&
        ((cartItems.length > 0 && !address) ||
          (cartItems.length < 1 && !connectedPKP))
          ? () =>
              dispatch(
                setLogin({
                  actionOpen: true,
                  actionHighlight:
                    cartItems.length < 1 && !address && !connectedPKP
                      ? undefined
                      : cartItems.length > 0 && !address
                      ? "crypto"
                      : "card",
                })
              )
          : cartItems.length < 1 && connectedPKP
          ? () => {}
          : chain !== 137
          ? openChainModal
          : approved
          ? () =>
              !signInLoading &&
              !cryptoCheckoutLoading &&
              cartItems?.length > 0 &&
              handleCheckoutCrypto!()
          : () =>
              !signInLoading &&
              !cryptoCheckoutLoading &&
              cartItems?.length > 0 &&
              handleApproveSpend!()
      }
    >
      <div
        className={`relative w-fit h-fit flex justify-center items-center ${
          (signInLoading || cryptoCheckoutLoading) && "animate-spin"
        }`}
      >
        {signInLoading || cryptoCheckoutLoading ? (
          <AiOutlineLoading size={15} color={"white"} />
        ) : cartItems.length < 1 && connectedPKP ? (
          "ADD TO CART"
        ) : !address || (!connectedPKP && cartItems.length < 1) ? (
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
