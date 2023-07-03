import { FunctionComponent } from "react";
import { CryptoProps } from "../types/synth.types";

const Crypto: FunctionComponent<CryptoProps> = ({
  openConnectModal,
  handleLensSignIn,
  address,
  profile,
  signInLoading,
}): JSX.Element => {
  return (
    <div className="relative w-20 h-10 rounded-md border border-white bg-azul text-white font-mana">
      <div
        className={`relative w-fit h-fit flex justify-center items-center ${
          signInLoading && "animate-spin"
        }`}
      ></div>
    </div>
  );
};

export default Crypto;
