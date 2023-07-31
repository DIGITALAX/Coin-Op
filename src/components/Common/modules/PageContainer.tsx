import { FunctionComponent } from "react";
import { PageContainerProps } from "../types/common.types";
import Format from "@/components/Walkthrough/Format/modules/Format";
import Layer from "@/components/Walkthrough/Layer/modules/Layer";
import Synth from "@/components/Walkthrough/Synth/modules/Synth";
import TopBanner from "./TopBanner";
import Composite from "@/components/Walkthrough/Composite/modules/Composite";
import Purchase from "@/components/Walkthrough/Purchase/modules/Purchase";
import templates from "./../../../../public/items/templates.json";

const PageContainer: FunctionComponent<PageContainerProps> = ({
  dispatch,
  template,
  synthLayer,
  synthLayerSelected,
  shareSet,
  setShareSet,
  scrollRef,
  cartItems,
  synthConfig,
  handleSynth,
  synthLoading,
  presets,
  address,
  profile,
  handleLensSignIn,
  openConnectModal,
  models,
  signInLoading,
  layersLoading,
  printTypeLayers,
  scrollToComposite,
  compositeRef,
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
  action,
  handleBlur,
  writingRef,
  selectedElement,
  font,
  fontOpen,
  setFont,
  setFontOpen,
  canvasExpand
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col gap-5">
      <TopBanner />
      <div className="relative w-full h-full flex flex-col overflow-y-scroll gap-20 justify-start items-center overflow-x-hidden">
        <Format dispatch={dispatch} template={template} templates={templates} />
        <Layer
          layers={printTypeLayers}
          dispatch={dispatch}
          synthLayer={synthLayer}
          layersLoading={layersLoading}
        />
        <Synth
          font={font}
          setFont={setFont}
          fontOpen={fontOpen}
          setFontOpen={setFontOpen}
          action={action}
          selectedElement={selectedElement}
          handleBlur={handleBlur}
          writingRef={writingRef}
          tool={tool}
          dispatch={dispatch}
          canvasExpand={canvasExpand}
          synthLayerSelected={synthLayerSelected}
          synthLayer={synthLayer}
          synthConfig={synthConfig}
          handleSynth={handleSynth}
          presets={presets}
          synthLoading={synthLoading}
          scrollToComposite={scrollToComposite}
          canvasRef={canvasRef}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          handleMouseMove={handleMouseMove}
          newLayersLoading={newLayersLoading}
          isDragging={isDragging}
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
          undo={undo}
          redo={redo}
          handleReset={handleReset}
        />
        <Composite
          dispatch={dispatch}
          setShareSet={setShareSet}
          shareSet={shareSet}
          address={address}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          profile={profile}
          models={models}
          signInLoading={signInLoading}
          compositeRef={compositeRef}
        />
        <Purchase
          dispatch={dispatch}
          scrollRef={scrollRef}
          cartItems={cartItems}
          signInLoading={signInLoading}
          address={address}
          openConnectModal={openConnectModal}
        />
      </div>
    </div>
  );
};

export default PageContainer;
