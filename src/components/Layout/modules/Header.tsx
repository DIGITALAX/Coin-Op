import Hook from "@/components/Common/modules/Hook";
import RollSearch from "@/components/Common/modules/RollSearch";
import { FunctionComponent } from "react";
import useRollSearch from "../hooks/useRollSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { HeaderProps } from "@/components/Common/types/common.types";
import { useAccountModal, useChainModal } from "@rainbow-me/rainbowkit";
import Sticky from "./Sticky";
import MobileFotos from "./MobileFotos";
import { useAccount, useNetwork } from "wagmi";

const Header: FunctionComponent<HeaderProps> = ({
  preRollRef,
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const { isConnected, address } = useAccount();
  const { chain: chainNetwork } = useNetwork();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const rollSearch = useSelector(
    (state: RootState) => state.app.rollSearchReducer.value
  );
  const cartAddAnim = useSelector(
    (state: RootState) => state.app.cartAddAnimReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const preRollsLoading = useSelector(
    (state: RootState) => state.app.prerollsLoadingReducer.value
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const videoPlayer = useSelector(
    (state: RootState) => state.app.videoPlayerReducer.open
  );
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const connectedPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );
  const algolia = useSelector(
    (state: RootState) => state.app.algoliaReducer.value
  );
  const chain = useSelector((state: RootState) => state.app.chainReducer.value);
  const {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
    scrollToCheckOut,
    handleSearchSimilar,
    handleAddToCart,
    cartAnim,
  } = useRollSearch(
    dispatch,
    isConnected,
    address,
    chainNetwork,
    algolia,
    cartItems
  );
  return (
    <div className="relative w-full h-fit items-center justify-center flex flex-col gap-20 px-3 pt-2 pb-20">
      <MobileFotos
        preRolls={preRolls}
        dispatch={dispatch}
        preRollsLoading={preRollsLoading}
      />
      <Sticky
        openChainModal={openChainModal}
        openAccountModal={openAccountModal}
        cartAnim={cartAnim}
        cartItems={cartItems}
        connected={connected}
        scrollToCheckOut={scrollToCheckOut}
        connectedPKP={connectedPKP}
        chain={chain}
        router={router}
        dispatch={dispatch}
        videoPlayer={videoPlayer}
      />
      {/* <div className="relative flex flex-col items-center justify-center w-full h-fit gap-28"> */}
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
        cartAddAnim={cartAddAnim}
      />
      <Hook preRollRef={preRollRef} />
      {/* </div> */}
    </div>
  );
};

export default Header;
