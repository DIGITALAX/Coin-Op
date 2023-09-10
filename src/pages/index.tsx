import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageContainer from "../components/Common/modules/PageContainer";
import useComposite from "@/components/Walkthrough/Composite/hooks/useComposite";
import { useContext, useEffect } from "react";
import { ScrollContext } from "./_app";
import { setPreRollAnim } from "../../redux/reducers/preRollAnimSlice";
import useSynth from "@/components/Walkthrough/Synth/hooks/useSynth";
import { useAccount } from "wagmi";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "@/components/Common/hooks/useSignIn";
import useLayer from "@/components/Walkthrough/Layer/hooks/useLayer";
import useCanvas from "@/components/Walkthrough/Synth/hooks/useCanvas";
import { setCartAddAnim } from "../../redux/reducers/cartAddAnimSlice";

export default function Home(): JSX.Element {
  const { scrollRef, synthRef } = useContext(ScrollContext);
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { handleLensSignIn, signInLoading } = useSignIn();
  const { setShareSet, shareSet, models } = useComposite();
  const {
    handleSynth,
    presets,
    scrollToComposite,
    compositeRef,
    handleDownloadImage,
    controlType,
    setControlType,
  } = useSynth();
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
    materialBackground,
    materialOpen,
    setMaterialBackground,
    setMaterialOpen,
    itemClicked,
    setItemClicked,
  } = useCanvas();

  const { layersLoading, scrollToPreRoll } = useLayer();

  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const apiKey = useSelector((state: RootState) => state.app.apiAddReducer);
  const canvasExpand = useSelector(
    (state: RootState) => state.app.expandCanvasReducer.value
  );
  const synthLoading = useSelector(
    (state: RootState) => state.app.synthLoadingReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const completedSynths = useSelector(
    (state: RootState) => state.app.completedSynthsReducer.value
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
  const cartAddAnim = useSelector(
    (state: RootState) => state.app.cartAddAnimReducer.value
  );
  const chain = useSelector((state: RootState) => state.app.chainReducer.value);

  useEffect(() => {
    if (preRollAnim) {
      setTimeout(() => {
        dispatch(setPreRollAnim(false));
      }, 3000);
    }
  }, [preRollAnim]);

  useEffect(() => {
    if (cartAddAnim) {
      setTimeout(() => {
        dispatch(setCartAddAnim(""));
      }, 3000);
    }
  }, [cartAddAnim]);

  return (
    <PageContainer
      controlType={controlType}
      setControlType={setControlType}
      template={template}
      tool={tool}
      scrollToPreRoll={scrollToPreRoll}
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
      materialBackground={materialBackground}
      setMaterialBackground={setMaterialBackground}
      materialOpen={materialOpen}
      setMaterialOpen={setMaterialOpen}
      completedSynths={completedSynths}
      handleDownloadImage={handleDownloadImage}
      itemClicked={itemClicked}
      setItemClicked={setItemClicked}
      synthRef={synthRef}
      chain={chain}
      openChainModal={openChainModal}
      apiKey={apiKey.key}
    />
  );
}
