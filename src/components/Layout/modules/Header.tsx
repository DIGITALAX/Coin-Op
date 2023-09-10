import Hook from "@/components/Common/modules/Hook";
import RollSearch from "@/components/Common/modules/RollSearch";
import { FunctionComponent } from "react";
import useRollSearch from "../hooks/useRollSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useRouter } from "next/router";
import { HeaderProps } from "@/components/Common/types/common.types";
import { useAccountModal, useChainModal } from "@rainbow-me/rainbowkit";
import Sticky from "./Sticky";
import MobileFotos from "./MobileFotos";

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
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const rollSearch = useSelector(
    (state: RootState) => state.app.rollSearchReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const preRollsLoading = useSelector(
    (state: RootState) => state.app.prerollsLoading.value
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
  const chain = useSelector((state: RootState) => state.app.chainReducer.value);
  const router = useRouter();
  const dispatch = useDispatch();
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
      />
      <Hook preRollRef={preRollRef} />
      {/* </div> */}
    </div>
  );
};

export default Header;
