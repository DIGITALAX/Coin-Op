import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageContainer from "../components/Common/modules/PageContainer";
import PreRolls from "../components/Common/modules/PreRolls";
import useComposite from "@/components/Walkthrough/Composite/hooks/useComposite";
import { useContext, useEffect } from "react";
import { ScrollContext } from "./_app";
import { setPreRollAnim } from "../../redux/reducers/preRollAnimSlice";
import useSynth from "@/components/Walkthrough/Synth/hooks/useSynth";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "@/components/Common/hooks/useSignIn";

export default function Home(): JSX.Element {
  const scrollRef = useContext(ScrollContext);
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { handleLensSignIn } = useSignIn();
  const { setShareSet, shareSet, models } = useComposite();
  const { handleSynth, synthLoading, presets } = useSynth();
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const synthLayer = useSelector(
    (state: RootState) => state.app.synthLayerReducer.value
  );
  const template = useSelector(
    (state: RootState) => state.app.templateReducer.value
  );
  const synthLayerSelected = useSelector(
    (state: RootState) => state.app.layerToSynthReducer.value
  );
  const synthConfig = useSelector(
    (state: RootState) => state.app.synthConfigReducer
  );
  const preRollAnim = useSelector(
    (state: RootState) => state.app.preRollAnimReducer.value
  );

  useEffect(() => {
    if (preRollAnim) {
      setTimeout(() => {
        dispatch(setPreRollAnim(false));
      }, 3000);
    }
  }, [preRollAnim]);

  return (
    <div className="relative overflow-hidden w-full h-[60rem] flex flex-row px-6 gap-10">
      <PreRolls
        cartItems={cartItems}
        dispatch={dispatch}
        preRolls={preRolls}
        left={true}
        preRollAnim={preRollAnim}
      />
      <PageContainer
        template={template}
        dispatch={dispatch}
        synthLayer={synthLayer}
        synthLayerSelected={synthLayerSelected}
        setShareSet={setShareSet}
        shareSet={shareSet}
        scrollRef={scrollRef}
        cartItems={cartItems}
        synthConfig={synthConfig}
        handleSynth={handleSynth}
        synthLoading={synthLoading}
        presets={presets}
        address={address}
        openConnectModal={openConnectModal}
        handleLensSignIn={handleLensSignIn}
        profile={profile}
        models={models}
      />
      <PreRolls
        cartItems={cartItems}
        dispatch={dispatch}
        preRolls={preRolls}
        right={true}
        preRollAnim={preRollAnim}
      />
    </div>
  );
}
