import { FunctionComponent } from "react";
import { PageContainerProps } from "../types/common.types";
import templates from "./../../../../public/items/templates.json";
import layers from "./../../../../public/items/layers.json";
import Format from "@/components/Walkthrough/Format/modules/Format";
import Layer from "@/components/Walkthrough/Layer/modules/Layer";
import Synth from "@/components/Walkthrough/Synth/modules/Synth";
import TopBanner from "./TopBanner";
import Composite from "@/components/Walkthrough/Composite/modules/Composite";
import Purchase from "@/components/Walkthrough/Purchase/modules/Purchase";

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
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col gap-5">
      <TopBanner />
      <div className="relative w-full h-full flex flex-col overflow-y-scroll gap-20 justify-start items-center overflow-x-hidden">
        <Format dispatch={dispatch} template={template} templates={templates} />
        <Layer layers={layers} dispatch={dispatch} synthLayer={synthLayer} />
        <Synth
          dispatch={dispatch}
          synthLayerSelected={synthLayerSelected}
          synthLayer={synthLayer}
          synthConfig={synthConfig}
          handleSynth={handleSynth}
          presets={presets}
          synthLoading={synthLoading}
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
        />
        <Purchase
          dispatch={dispatch}
          scrollRef={scrollRef}
          cartItems={cartItems}
        />
      </div>
    </div>
  );
};

export default PageContainer;
