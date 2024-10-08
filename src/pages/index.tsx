import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import PageContainer from "../components/Common/modules/PageContainer";
import useComposite from "@/components/Walkthrough/Composite/hooks/useComposite";
import { useContext, useEffect } from "react";
import { ScrollContext } from "./_app";
import { setPrerollAnim } from "../../redux/reducers/prerollAnimSlice";
import useSynth from "@/components/Walkthrough/Synth/hooks/useSynth";
import { useAccount } from "wagmi";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSignIn from "@/components/Common/hooks/useSignIn";
import useLayer from "@/components/Walkthrough/Layer/hooks/useLayer";
import useCanvas from "@/components/Walkthrough/Synth/hooks/useCanvas";
import { setCartAddAnim } from "../../redux/reducers/cartAddAnimSlice";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import useCheckout from "@/components/Walkthrough/Purchase/hooks/useCheckout";
import { NextRouter } from "next/router";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function Home({
  client,
  router,
}: {
  client: LitNodeClient;
  router: NextRouter;
}): JSX.Element {
  const { t } = useTranslation("common");
  const { scrollRef, synthRef } = useContext(ScrollContext);
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });

  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const apiKey = useSelector((state: RootState) => state.app.apiAddReducer);
  const canvasExpand = useSelector(
    (state: RootState) => state.app.expandCanvasReducer.value
  );
  const synthProgress = useSelector(
    (state: RootState) => state.app.synthProgressReducer.value
  );
  const canvasSize = useSelector(
    (state: RootState) => state.app.canvasSizeReducer.value
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
  const elements = useSelector(
    (state: RootState) => state.app.setElementsReducer.value
  );
  const template = useSelector(
    (state: RootState) => state.app.templateReducer.value
  );
  const layerToSynth = useSelector(
    (state: RootState) => state.app.layerToSynthReducer.value
  );
  const printTypeLayers = useSelector(
    (state: RootState) => state.app.printTypeLayersReducer.value
  );
  const synthConfig = useSelector(
    (state: RootState) => state.app.synthConfigReducer
  );
  const prerollAnim = useSelector(
    (state: RootState) => state.app.prerollAnimReducer.value
  );
  const cartAddAnim = useSelector(
    (state: RootState) => state.app.cartAddAnimReducer.value
  );
  const chain = useSelector((state: RootState) => state.app.chainReducer.value);

  const { handleLensSignIn, signInLoading } = useSignIn(
    dispatch,
    address,
    isConnected,
    openAccountModal,
    oracleData,
    profile
  );
  const { setShareSet, shareSet, models } = useComposite();
  const {
    handleSynth,
    presets,
    scrollToComposite,
    compositeRef,
    handleDownloadImage,
    controlType,
    setControlType,
  } = useSynth(
    dispatch,
    synthConfig,
    apiKey,
    elements,
    layerToSynth,
    completedSynths,
    synthLoading,
    canvasSize
  );
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
  } = useCanvas(
    dispatch,
    layerToSynth,
    synthLayer,
    synthLoading,
    completedSynths,
    synthProgress,
    canvasSize,
    canvasExpand
  );
  const {
    chooseCartItem,
    collectItem,
    collectPostLoading,
    checkoutCurrency,
    setCheckoutCurrency,
    setFulfillmentDetails,
    fulfillmentDetails,
    encryptFulfillment,
    encrypted,
    setEncrypted,
    approveSpend,
    openCountryDropdown,
    setOpenCountryDropdown,
    setChooseCartItem,
    isApprovedSpend,
    startIndex,
    setStartIndex,
  } = useCheckout(
    publicClient,
    dispatch,
    address,
    profile,
    client,
    oracleData,
    cartItems,
    router,
    t
  );

  const { layersLoading, scrollToPreroll } = useLayer(dispatch, template);
  useEffect(() => {
    if (prerollAnim) {
      setTimeout(() => {
        dispatch(setPrerollAnim(false));
      }, 3000);
    }
  }, [prerollAnim]);

  useEffect(() => {
    if (cartAddAnim) {
      setTimeout(() => {
        dispatch(setCartAddAnim(""));
      }, 3000);
    }
  }, [cartAddAnim]);

  return (
    <>
      <Head>
        <title>Coin Op</title>
        <meta name="og:url" content="https://coinop.themanufactory.xyz/" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content="Coin Op" />
        <meta
          name="og:description"
          content="We know it's a lot to keep up with. How can you know if this is the blend of instant convenience and purchasing power you've been waiting for?"
        />
        <meta
          name="og:image"
          content="https://coinop.themanufactory.xyz/card.png/"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="og:url" content="https://coinop.themanufactory.xyz/" />
        <meta
          name="og:image"
          content="https://coinop.themanufactory.xyz/card.png/"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax_" />
        <meta name="twitter:creator" content="@digitalax_" />
        <meta
          name="twitter:image"
          content="https://coinop.themanufactory.xyz/card.png/"
        />
        <meta name="twitter:url" content="https://coinop.themanufactory.xyz/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="canonical" href="https://coinop.themanufactory.xyz/" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/MegamaxJones.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/Vcr.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/MonumentExtendedR.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/AquaticoRegular.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/SatoshiRegular.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/SatoshiBlack.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/fonts/HermanoAltoStamp.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/Manaspace.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
      <PageContainer
        router={router}
        setStartIndex={setStartIndex}
        startIndex={startIndex}
        encrypted={encrypted}
        t={t}
        setEncrypted={setEncrypted}
        setOpenCountryDropDown={setOpenCountryDropdown}
        openCountryDropDown={openCountryDropdown}
        controlType={controlType}
        setControlType={setControlType}
        template={template}
        tool={tool}
        setFulfillmentDetails={setFulfillmentDetails}
        cartItem={chooseCartItem}
        setCartItem={setChooseCartItem}
        setCheckoutCurrency={setCheckoutCurrency}
        checkoutCurrency={checkoutCurrency}
        oracleValue={oracleData}
        handleApproveSpend={approveSpend}
        handleCheckoutCrypto={collectItem}
        approved={isApprovedSpend}
        cryptoCheckoutLoading={collectPostLoading}
        scrollToPreroll={scrollToPreroll}
        dispatch={dispatch}
        isDragging={isDragging}
        synthLayer={synthLayer}
        undo={undo}
        font={font}
        encryptFulfillment={encryptFulfillment}
        setFont={setFont}
        fontOpen={fontOpen}
        setFontOpen={setFontOpen}
        redo={redo}
        canvasExpand={canvasExpand}
        handleReset={handleReset}
        layerToSynth={layerToSynth}
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
        fulfillmentDetails={fulfillmentDetails}
      />
    </>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"])),
  },
});
