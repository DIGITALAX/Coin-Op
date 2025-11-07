import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import useLens from "@/app/components/Common/hooks/useLens";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { CryptoProps } from "../../types/walkthrough.types";

const Crypto: FunctionComponent<CryptoProps> = ({
  handleCheckout,
  checkoutLoading,
  approved,
  currentCartItems,
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
        !lensCargando && !checkoutLoading && Number(currentCartItems?.length) > 0
          ? "cursor-pointer active:scale-95"
          : "opacity-70"
      } `}
      onClick={
        !lensCargando && !checkoutLoading && Number(currentCartItems?.length) > 0 
          ? !address
            ? () => openOnboarding()
            : chainId !== 232
            ? () => openSwitchNetworks()
            : !context?.lensConectado?.profile &&
              context?.purchaseMode == "prerolls"
            ? () => handleConectarse()
            : !(context?.purchaseMode == "prerolls"
                ? approved?.prerolls
                : approved?.market)
            ? () =>
                Number(currentCartItems?.length) > 0 && handleApproveSpend!()
            : () => Number(currentCartItems?.length) > 0 && handleCheckout!()
          : () => {}
      }
    >
      <div
        className={`relative w-fit h-fit flex justify-center items-center ${
          (lensCargando || checkoutLoading) && "animate-spin"
        }`}
      >
        {lensCargando || checkoutLoading ? (
          <AiOutlineLoading size={15} color={"white"} />
        ) : Number(currentCartItems?.length) < 1 ? (
          dict?.Common?.add
        ) : !address ? (
          dict?.Common?.conn
        ) : !context?.lensConectado?.profile &&
          context?.purchaseMode == "prerolls" ? (
          "LENS"
        ) : !(context?.purchaseMode == "prerolls"
            ? approved?.prerolls
            : approved?.market) ? (
          dict?.Common?.app
        ) : (
          dict?.Common?.check
        )}
      </div>
    </div>
  );
};

export default Crypto;
