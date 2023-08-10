import Hook from "@/components/Common/modules/Hook";
import RollSearch from "@/components/Common/modules/RollSearch";
import { FunctionComponent } from "react";
import useRollSearch from "../hooks/useRollSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeaderProps } from "@/components/Common/types/common.types";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";

const Header: FunctionComponent<HeaderProps> = ({
  preRollRef,
}): JSX.Element => {
  const {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
    scrollToCheckOut,
    handleSearchSimilar,
    handleAddToCart,
    cartAnim,
  } = useRollSearch();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const rollSearch = useSelector(
    (state: RootState) => state.app.rollSearchReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const chain = useSelector((state: RootState) => state.app.chainReducer.value);
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div className="relative w-full flex flex-col gap-20 px-3 pt-2 pb-20">
      <div className="flex w-full h-fit text-white font-mega items-center justify-center md:justify-between md:flex-nowrap flex-wrap md:gap-0 gap-3">
        <Link
          className="relative flex justify-start w-fit h-fit items-center whitespace-nowrap break-words cursor-pointer"
          href={"/"}
        >
          coin op
        </Link>
        <div className="relative flex w-full h-fit items-center justify-center">
          <div
            className="relative w-fit px-2 py-1.5 h-full items-center justify-center flex flex-row border border-white/40 rounded-full gap-2 cursor-pointer active:scale-95"
            onClick={
              router.asPath.includes("account")
                ? async () => {
                    await router.push("/");
                    scrollToCheckOut();
                  }
                : () => scrollToCheckOut()
            }
            id={cartAnim ? "cartAnim" : ""}
          >
            <div className="relative text-white font-mana text-xs items-center justify-center">
              {cartItems.reduce(
                (total, cartItem) => total + cartItem.amount,
                0
              )}{" "}
              items in cart
            </div>
            <div className="relative h-4 w-px bg-white/50"></div>
            <div className="relative w-4 h-3 flex items-center justify-center">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmcDmX2FmwjrhVDLpNii6NdZ4KisoPLMjpRUheB6icqZcV`}
                layout="fill"
                draggable={false}
              />
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center md:ml-auto">
          <div
            className="relative w-20 h-7 px-1 text-white flex items-center justify-center border border-white cursor-pointer"
            onClick={
              chain !== 137
                ? openChainModal
                : connected
                ? openAccountModal
                : openConnectModal
            }
          >
            <div className="relative text-xxs font-mana">
              {chain !== 137 ? "Switch" : connected ? "Connected" : "Connect"}
            </div>
          </div>
          <Link
            href={"/account"}
            className="relative flex w-8 h-6 items-center break-words cursor-pointer"
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmT18k71KZATGmJ8em4hUBRCAQVKmrBAb7QeLWTt5G9LdV`}
              draggable={false}
            />
          </Link>
          <Link
            href={"/quests"}
            className="relative flex  w-8 h-6 items-center break-words cursor-pointer"
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmZt7axg3QPFTg6DFwTxHkEMvTi6dPhwQQLcHAiiuGJiAa`}
              draggable={false}
            />
          </Link>
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-center w-full h-fit gap-28">
        <RollSearch
          rollSearch={rollSearch}
          handleRollSearch={handleRollSearch}
          setPrompt={setPrompt}
          prompt={prompt}
          handleSearchSimilar={handleSearchSimilar}
          dispatch={dispatch}
          handlePromptChoose={handlePromptChoose}
          handleAddToCart={handleAddToCart}
          router={router}
        />
        <Hook preRollRef={preRollRef} />
      </div>
    </div>
  );
};

export default Header;
