import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import General from "./General";
import NoHandle from "./NoHandle";
import Index from "./Index";
import { useRef } from "react";
import ImageLarge from "./ImageLarge";
import SearchExpand from "./SearchExpand";
import useRollSearch from "@/components/Layout/hooks/useRollSearch";
import ApiAdd from "./ApiAdd";
import { NextRouter } from "next/router";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import FullScreenVideo from "./FullScreenVideo";
import useControls from "../../hooks/useControls";
import Who from "./Who";
import { useAccount, useNetwork } from "wagmi";
import useSignIn from "../../hooks/useSignIn";
import useWho from "../../hooks/useWho";
import useChannels from "../../hooks/useChannels";
import useInteractionsPlayer from "../../hooks/useInteractionsPlayer";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import InsufficientBalance from "./InsufficientBalance";
import QuoteBox from "./QuoteBox";
import useQuote from "../../hooks/useQuote";
import PostCollect from "./PostCollect";

const Modals = ({ router }: { router: NextRouter }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();
  const { chain: chainNetwork } = useNetwork();
  const { openAccountModal } = useAccountModal();
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
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.videoPlayerReducer
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const searchExpand = useSelector(
    (state: RootState) => state.app.searchExpandReducer
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
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
  const seek = useSelector((state: RootState) => state.app.seekReducer.seek);
  const imageModal = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const reactBox = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const reactions = useSelector(
    (state: RootState) => state.app.videoCountReducer
  );
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer?.currencies
  );
  const postCollect = useSelector(
    (state: RootState) => state.app.postCollectReducer
  );
  const hasMore = useSelector(
    (state: RootState) => state.app.hasMoreVideoReducer.value
  );
  const quoteBox = useSelector((state: RootState) => state.app.quoteBoxReducer);
  const apiAdd = useSelector((state: RootState) => state.app.apiAddReducer);
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const prerolls = useSelector((state: RootState) => state.app.prerollReducer);
  const noHandle = useSelector((state: RootState) => state.app.noHandleReducer);
  const reactId = useSelector(
    (state: RootState) => state.app.reactIdReducer.value
  );

  const { handleLensSignIn } = useSignIn(
    dispatch,
    address,
    isConnected,
    openAccountModal,
    oracleData,
    lensProfile
  );
  const { handlePromptChoose, handleSearchSimilar } = useRollSearch(
    dispatch,
    isConnected,
    address,
    chainNetwork,
    cartItems,
    lensProfile
  );
  const { openConnectModal } = useConnectModal();
  const {
    formatTime,
    volume,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    mirrorLoading,
    collectLoading,
    likeLoading,
    collectVideo,
    mirrorVideo,
    likeVideo,
    mirrorCommentLoading,
    likeCommentLoading,
    collectCommentLoading,
    handleVolumeChange,
    wrapperRef,
    progressRef,
    handleSeek,
    fullVideoRef,
  } = useControls(
    publicClient,
    dispatch,
    address,
    lensProfile,
    mainVideo,
    fullScreenVideo,
    videoSync,
    seek,
    commentId,
    indexModal
  );
  const { fetchMoreVideos, videoLoading, setVideoLoading } = useChannels(
    dispatch,
    mainVideo,
    lensProfile,
    dispatchVideos,
    indexModal.message,
    reactId,
    videoSync,
    reactions
  );
  const {
    commentors,
    getMorePostComments,
    commentsLoading,
    hasMoreComments,
    commentsOpen,
    setCommentsOpen,
  } = useInteractionsPlayer(lensProfile, mainVideo, commentId, indexModal);
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
  } = useWho(lensProfile, reactBox, dispatch, address, publicClient);

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
    quoteBox
  );
  return (
    <>
      {fullScreenVideo.open && (
        <FullScreenVideo
          lensProfile={lensProfile}
          openConnectModal={openConnectModal}
          formatTime={formatTime}
          dispatch={dispatch}
          mainVideo={mainVideo}
          streamRef={fullVideoRef}
          wrapperRef={wrapperRef}
          dispatchVideos={dispatchVideos}
          videoSync={videoSync}
          videoRef={videoRef}
          hasMore={hasMore}
          connected={connected}
          videoLoading={videoLoading}
          setVideoLoading={setVideoLoading}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          volumeOpen={volumeOpen}
          setVolumeOpen={setVolumeOpen}
          handleHeart={handleHeart}
          collected={mainVideo.collected}
          mirrored={mainVideo.mirrored}
          liked={mainVideo.liked}
          mirrorVideo={mirrorVideo}
          collectVideo={collectVideo}
          likeVideo={likeVideo}
          likeLoading={likeLoading}
          collectLoading={collectLoading}
          mirrorLoading={mirrorLoading}
          profileId={lensProfile?.id}
          progressRef={progressRef}
          handleSeek={handleSeek}
          collectAmount={reactions.collect}
          mirrorAmount={reactions.mirror}
          likeAmount={reactions.like}
          fetchMoreVideos={fetchMoreVideos}
          commentId={commentId}
          commentors={commentors}
          collectCommentLoading={collectCommentLoading}
          commentsLoading={commentsLoading}
          mirrorCommentLoading={mirrorCommentLoading}
          likeCommentLoading={likeCommentLoading}
          hasMoreComments={hasMoreComments}
          getMorePostComments={getMorePostComments}
          commentsOpen={commentsOpen}
          setCommentsOpen={setCommentsOpen}
          handleLensSignIn={handleLensSignIn}
        />
      )}
      {quoteBox?.open && (
        <QuoteBox
          type={quoteBox?.type!}
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
      {noHandle.value && <NoHandle dispatch={dispatch} />}
      {generalModal?.open && (
        <General message={generalModal.message} dispatch={dispatch} />
      )}
      {indexModal?.value && <Index message={indexModal?.message} />}
      {apiAdd?.open && <ApiAdd dispatch={dispatch} />}
      {searchExpand?.value && (
        <SearchExpand
          searchItem={searchExpand?.value}
          dispatch={dispatch}
          cartItems={cartItems}
          prerolls={prerolls}
          handlePromptChoose={handlePromptChoose}
          handleSearchSimilar={handleSearchSimilar}
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
