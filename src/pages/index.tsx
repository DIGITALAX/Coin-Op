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
import usePreRoll from "@/components/Common/hooks/usePreRoll";
import useLayer from "@/components/Walkthrough/Layer/hooks/useLayer";
import useCanvas from "@/components/Walkthrough/Synth/hooks/useCanvas";

export default function Home(): JSX.Element {
  const scrollRef = useContext(ScrollContext);
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { handleLensSignIn, signInLoading } = useSignIn();
  const { setShareSet, shareSet, models } = useComposite();
  const { handleSynth, presets, scrollToComposite, compositeRef } = useSynth();
  const {
    canvasRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    newLayersLoading,
    isDragging,
    hex,
    setHex,
    setColorPicker,
    showBottomOptions,
    setShowBottomOptions,
    thickness,
    setThickness,
    brushWidth,
    setBrushWidth,
    setTool,
    colorPicker,
    tool,
    undo,
    redo,
    handleReset,
    writingRef,
    handleBlur,
    action,
    selectedElement,
    font,
    fontOpen,
    setFont,
    setFontOpen,
  } = useCanvas();
  const { preRollsLoading } = usePreRoll();
  const { layersLoading } = useLayer();
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const canvasExpand = useSelector(
    (state: RootState) => state.app.expandCanvasReducer.value
  );
  const synthLoading = useSelector(
    (state: RootState) => state.app.synthLoadingReducer.value
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
  const printTypeLayers = useSelector(
    (state: RootState) => state.app.printTypeLayersReducer.value
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
        preRollsLoading={preRollsLoading}
      />
      <PageContainer
        template={template}
        tool={tool}
        dispatch={dispatch}
        isDragging={isDragging}
        synthLayer={synthLayer}
        undo={undo}
        font={font}
        setFont={setFont}
        fontOpen={fontOpen}
        setFontOpen={setFontOpen}
        redo={redo}
        canvasExpand={canvasExpand}
        handleReset={handleReset}
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
        selectedElement={selectedElement}
        openConnectModal={openConnectModal}
        handleLensSignIn={handleLensSignIn}
        profile={profile}
        models={models}
        signInLoading={signInLoading}
        layersLoading={layersLoading}
        printTypeLayers={printTypeLayers}
        scrollToComposite={scrollToComposite}
        compositeRef={compositeRef}
        canvasRef={canvasRef}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        newLayersLoading={newLayersLoading}
        handleMouseMove={handleMouseMove}
        showBottomOptions={showBottomOptions}
        setShowBottomOptions={setShowBottomOptions}
        colorPicker={colorPicker}
        setColorPicker={setColorPicker}
        hex={hex}
        setHex={setHex}
        setThickness={setThickness}
        thickness={thickness}
        setBrushWidth={setBrushWidth}
        brushWidth={brushWidth}
        setTool={setTool}
        action={action}
        handleBlur={handleBlur}
        writingRef={writingRef}
      />
      <PreRolls
        cartItems={cartItems}
        dispatch={dispatch}
        preRolls={preRolls}
        right={true}
        preRollAnim={preRollAnim}
        preRollsLoading={preRollsLoading}
      />
    </div>
  );
}
