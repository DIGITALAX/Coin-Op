import Hook from "@/components/Common/modules/Hook";
import RollSearch from "@/components/Common/modules/RollSearch";
import { FunctionComponent } from "react";
import useRollSearch from "../hooks/useRollSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { HeaderProps } from "@/components/Common/types/common.types";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import Sticky from "./Sticky";
import MobileFotos from "./MobileFotos";
import { useAccount, useNetwork } from "wagmi";
import useSignIn from "@/components/Common/hooks/useSignIn";

const Header: FunctionComponent<HeaderProps> = ({
  prerollRef,
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const { isConnected, address } = useAccount();
  const { chain: chainNetwork } = useNetwork();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const rollSearch = useSelector(
    (state: RootState) => state.app.rollSearchReducer.value
  );
  const cartAddAnim = useSelector(
    (state: RootState) => state.app.cartAddAnimReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const prerollsLoading = useSelector(
    (state: RootState) => state.app.prerollsLoadingReducer.value
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer?.profile
  );
  const prerolls = useSelector((state: RootState) => state.app.prerollReducer);
  const chain = useSelector((state: RootState) => state.app.chainReducer.value);
  const {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
    scrollToCheckOut,
    searchLoading,
    handleAddToCart,
    cartAnim,
  } = useRollSearch(
    dispatch,
    isConnected,
    address,
    chainNetwork,
    cartItems,
    profile
  );
  const { handleLensSignIn, signInLoading, handleLogout } = useSignIn(
    dispatch,
    address,
    isConnected,
    openAccountModal,
    oracleData,
    profile
  );
  return (
    <div className="relative w-full h-fit items-center justify-center flex flex-col gap-20 px-3 pt-2 pb-20">
      <MobileFotos
        prerolls={prerolls}
        dispatch={dispatch}
        prerollsLoading={prerollsLoading}
      />
      <Sticky
        openConnectModal={openConnectModal}
        openChainModal={openChainModal}
        handleLogout={handleLogout}
        cartAnim={cartAnim}
        cartItems={cartItems}
        connected={connected}
        scrollToCheckOut={scrollToCheckOut}
        chain={chain}
        router={router}
        dispatch={dispatch}
        fullScreenVideo={fullScreenVideo}
        handleLensSignIn={handleLensSignIn}
        profile={profile}
        signInLoading={signInLoading}
      />
      {/* <div className="relative flex flex-col items-center justify-center w-full h-fit gap-28"> */}
      <RollSearch
        rollSearch={rollSearch}
        handleRollSearch={handleRollSearch}
        setPrompt={setPrompt}
        prompt={prompt}
        searchLoading={searchLoading}
        dispatch={dispatch}
        handlePromptChoose={handlePromptChoose}
        handleAddToCart={handleAddToCart}
        router={router}
        cartAddAnim={cartAddAnim}
      />
      <Hook prerollRef={prerollRef} />
      {/* </div> */}
    </div>
  );
};

export default Header;
