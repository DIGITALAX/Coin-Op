import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import useLens from "@/app/components/Common/hooks/useLens";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { CryptoProps } from "../../types/walkthrough.types";

const Crypto: FunctionComponent<CryptoProps> = ({
  handleCheckoutCrypto,
  cryptoCheckoutLoading,
  approved,
  handleApproveSpend,
  dict,
}): JSX.Element => {
  const { address, isConnected, chainId } = useAccount();
  const { openOnboarding, openSwitchNetworks } = useModal();
  const context = useContext(ModalContext);
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  return (
    <div
      className={`relative w-full h-12 rounded-md border border-white bg-azul text-white font-mana items-center justify-center flex  ${
        !lensCargando && !cryptoCheckoutLoading
          ? "cursor-pointer active:scale-95"
          : "opacity-70"
      } `}
      onClick={
        !lensCargando && !cryptoCheckoutLoading
          ? !address
            ? () => openOnboarding()
            : chainId !== 137
            ? () => openSwitchNetworks()
            : !context?.lensConectado?.profile
            ? () => handleConectarse()
            : !approved
            ? () =>
                Number(context?.cartItems?.length) > 0 && handleApproveSpend!()
            : () =>
                Number(context?.cartItems?.length) > 0 &&
                handleCheckoutCrypto!()
          : () => {}
      }
    >
      <div
        className={`relative w-fit h-fit flex justify-center items-center ${
          (lensCargando || cryptoCheckoutLoading) && "animate-spin"
        }`}
      >
        {lensCargando || cryptoCheckoutLoading ? (
          <AiOutlineLoading size={15} color={"white"} />
        ) : Number(context?.cartItems.length) < 1 ? (
          dict?.Common?.add
        ) : !address ? (
          dict?.Common?.conn
        ) : !context?.lensConectado?.profile ? (
          "LENS"
        ) : !approved ? (
          dict?.Common?.app
        ) : (
          dict?.Common?.check
        )}
      </div>
    </div>
  );
};

export default Crypto;
