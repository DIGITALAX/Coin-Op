import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import General from "./General";
import NoHandle from "./NoHandle";
import Index from "./Index";
import ImageLarge from "./ImageLarge";
import SearchExpand from "./SearchExpand";
import useRollSearch from "@/components/Layout/hooks/useRollSearch";
import ApiAdd from "./ApiAdd";
import { NextRouter } from "next/router";
import FullScreenVideo from "./FullScreenVideo";
import Who from "./Who";
import { useAccount, useNetwork } from "wagmi";
import useWho from "../../hooks/useWho";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import InsufficientBalance from "./InsufficientBalance";
import QuoteBox from "./QuoteBox";
import useQuote from "../../hooks/useQuote";
import PostCollect from "./PostCollect";
import useVideo from "../../hooks/useVideo";
import { RefObject } from "react";
import { useTranslation } from "next-i18next";

const Modals = ({ router }: { router: NextRouter }) => {
  const { address, isConnected } = useAccount();
  const { chain: chainNetwork } = useNetwork();
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const generalModal = useSelector(
    (state: RootState) => state.app.modalOpenReducer
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const searchExpand = useSelector(
    (state: RootState) => state.app.searchExpandReducer
  );
  const cartAddAnim = useSelector(
    (state: RootState) => state.app.cartAddAnimReducer.value
  );
  const insufficientBalance = useSelector(
    (state: RootState) => state.app.insufficientBalanceReducer
  );
  const indexModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const imageModal = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer?.currencies
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const reactBox = useSelector((state: RootState) => state.app.reactBoxReducer);
  const postCollect = useSelector(
    (state: RootState) => state.app.postCollectReducer
  );
  const quoteBox = useSelector((state: RootState) => state.app.quoteBoxReducer);
  const apiAdd = useSelector((state: RootState) => state.app.apiAddReducer);
  const prerolls = useSelector((state: RootState) => state.app.prerollReducer);
  const noHandle = useSelector((state: RootState) => state.app.noHandleReducer);

  const { handlePromptChoose } = useRollSearch(
    dispatch,
    isConnected,
    address,
    chainNetwork,
    cartItems,
    lensProfile,
    t
  );
  const {
    dataLoading,
    reactors,
    quoters,
    hasMore: hasMoreWho,
    hasMoreQuote,
    showMore,
    mirrorQuote,
    setMirrorQuote,
    like,
    mirror,
    openMirrorChoice,
    setOpenMirrorChoice,
    simpleCollect,
    interactionsLoading,
  } = useWho(lensProfile, reactBox, dispatch, address, publicClient, t);
  const {
    videoRef,
    videoLoading,
    handleNextVideo,
    handlePlayPause,
    handleSeek,
    handleVolumeChange,
    wrapperRef,
  } = useVideo(fullScreenVideo, dispatch, lensProfile);

  const {
    quote,
    quoteLoading,
    setMakeQuote,
    makeQuote,
    collects,
    setCollects,
    openMeasure,
    setOpenMeasure,
    mentionProfiles,
    setMentionProfiles,
    caretCoord,
    setCaretCoord,
    setProfilesOpen,
    profilesOpen,
  } = useQuote(
    availableCurrencies,
    postCollect,
    dispatch,
    publicClient,
    address,
    quoteBox,
    t
  );
  return (
    <>
      {fullScreenVideo?.open && (
        <FullScreenVideo
          dispatch={dispatch}
          fullScreenVideo={fullScreenVideo}
          videoRef={videoRef as RefObject<HTMLVideoElement>}
          loading={videoLoading}
          handleNextVideo={handleNextVideo}
          handlePlayPause={handlePlayPause}
          handleVolumeChange={handleVolumeChange}
          handleSeek={handleSeek}
          wrapperRef={wrapperRef}
        />
      )}
      {quoteBox?.open && (
        <QuoteBox
          type={quoteBox?.type!}
          t={t}
          lensConnected={lensProfile}
          setCaretCoord={setCaretCoord}
          setMentionProfiles={setMentionProfiles}
          setProfilesOpen={setProfilesOpen}
          profilesOpen={profilesOpen}
          mentionProfiles={mentionProfiles}
          caretCoord={caretCoord}
          dispatch={dispatch}
          router={router}
          quote={quoteBox?.quote}
          makePost={makeQuote}
          setMakePost={setMakeQuote}
          post={quote}
          postLoading={quoteLoading}
          postCollect={postCollect}
        />
      )}
      {postCollect?.id && (
        <PostCollect
          dispatch={dispatch}
          t={t}
          openMeasure={openMeasure}
          setOpenMeasure={setOpenMeasure}
          availableCurrencies={availableCurrencies}
          collects={collects}
          setCollects={setCollects}
          id={postCollect?.id!}
          collectTypes={postCollect?.collectTypes}
        />
      )}
      {reactBox?.open && (
        <Who
          router={router}
          dispatch={dispatch}
          type={reactBox.type!}
          reactors={reactors}
          dataLoading={dataLoading}
          quoters={quoters}
          hasMore={hasMoreWho}
          hasMoreQuote={hasMoreQuote}
          showMore={showMore}
          t={t}
          mirrorQuote={mirrorQuote}
          setMirrorQuote={setMirrorQuote}
          like={like}
          mirror={mirror}
          openMirrorChoice={openMirrorChoice}
          setOpenMirrorChoice={setOpenMirrorChoice}
          simpleCollect={simpleCollect}
          interactionsLoading={interactionsLoading}
        />
      )}
      {noHandle.value && <NoHandle t={t} dispatch={dispatch} />}
      {generalModal?.open && (
        <General t={t} message={generalModal.message} dispatch={dispatch} />
      )}
      {indexModal?.value && <Index message={indexModal?.message} />}
      {apiAdd?.open && <ApiAdd t={t} dispatch={dispatch} />}
      {searchExpand?.value && (
        <SearchExpand
          t={t}
          searchItem={searchExpand?.value}
          dispatch={dispatch}
          cartItems={cartItems}
          prerolls={prerolls}
          handlePromptChoose={handlePromptChoose}
          router={router}
          cartAddAnim={cartAddAnim}
        />
      )}
      {insufficientBalance?.value && (
        <InsufficientBalance
          dispatch={dispatch}
          message={insufficientBalance?.message!}
        />
      )}
      {imageModal?.value && (
        <ImageLarge mainImage={imageModal.image} dispatch={dispatch} />
      )}
    </>
  );
};

export default Modals;
