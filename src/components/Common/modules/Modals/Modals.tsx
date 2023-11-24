import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import General from "./General";
import PostBox from "./PostBox";
import NoHandle from "./NoHandle";
import useImageUpload from "../../hooks/useImageUpload";
import useCollectOptions from "../../hooks/useCollectOptions";
import useMakePost from "../../hooks/useMakePost";
import Index from "./Index";
import { useEffect, useRef, useState } from "react";
import ImageLarge from "./ImageLarge";
import Messages from "./Messages";
import SearchExpand from "./SearchExpand";
import useRollSearch from "@/components/Layout/hooks/useRollSearch";
import ApiAdd from "./ApiAdd";
import { NextRouter } from "next/router";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Login from "./Login";
import useLogin from "@/components/Layout/hooks/useLogin";
import QuestPrelude from "./QuestPrelude";
import useQuest from "@/components/Quests/hooks/useQuest";
import FullScreenVideo from "./FullScreenVideo";
import useControls from "../../hooks/useControls";
import Purchase from "./Purchase";
import Who from "./Who";
import FollowerOnly from "./FollowerOnly";
import { useAccount, useNetwork } from "wagmi";
import useSignIn from "../../hooks/useSignIn";
import useWho from "../../hooks/useWho";
import useFollowers from "../../hooks/useFollowers";
import useChannels from "../../hooks/useChannels";
import useInteractions from "../../hooks/useInteractions";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { LitAuthClient } from "@lit-protocol/lit-auth-client";

const Modals = ({
  router,
  client,
  authClient,
}: {
  router: NextRouter;
  client: LitNodeClient;
  authClient: LitAuthClient;
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();
  const { chain: chainNetwork } = useNetwork();
  const dispatch = useDispatch();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const generalModal = useSelector(
    (state: RootState) => state.app.modalOpenReducer
  );
  const isSubscribed = useSelector(
    (state: RootState) => state.app.allSubscriptionsReducer.value?.isSubscribed
  );
  const questPoints = useSelector(
    (state: RootState) => state.app.questPointsReducer.value
  );
  const connectedPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
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
  const questPrelude = useSelector(
    (state: RootState) => state.app.questPreludeReducer
  );
  const messageModal = useSelector(
    (state: RootState) => state.app.messagesModalReducer
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const currentPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
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
  const chain = useSelector((state: RootState) => state.app.chainReducer.value);
  const login = useSelector((state: RootState) => state.app.loginReducer);
  const lensPost = useSelector(
    (state: RootState) => state.app.lensPostBoxReducer
  );
  const indexModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const seek = useSelector((state: RootState) => state.app.seekReducer.seek);
  const imageModal = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const algolia = useSelector(
    (state: RootState) => state.app.algoliaReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const collectModuleValues = useSelector(
    (state: RootState) => state.app.postCollectValuesReducer
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueReducer.type
  );
  const reaction = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const reactions = useSelector(
    (state: RootState) => state.app.videoCountReducer
  );
  const followersModal = useSelector(
    (state: RootState) => state.app.followerOnlyReducer
  );
  const purchaseModal = useSelector(
    (state: RootState) => state.app.purchaseReducer
  );
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const hasMore = useSelector(
    (state: RootState) => state.app.hasMoreVideoReducer.value
  );
  const apiAdd = useSelector((state: RootState) => state.app.apiAddReducer);
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const noHandle = useSelector((state: RootState) => state.app.noHandleReducer);
  const reactId = useSelector(
    (state: RootState) => state.app.reactIdReducer.value
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImagesReducer.value
  );
  const [distanceFromBottom, setDistanceFromBottom] = useState<number>(10);

  useEffect(() => {
    const handleScroll = () => {
      const distance =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      setDistanceFromBottom(distance + 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const { handleLensSignIn } = useSignIn(dispatch, address, isConnected);
  const {
    videoLoading,
    uploadImage,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
  } = useImageUpload(dispatch, lensPost.value, postImagesDispatched);
  const { loginWithWeb2Auth, loginLoading } = useLogin(
    client,
    publicClient,
    address,
    router,
    dispatch,
    authClient,
    fulfillmentDetails,
    connectedPKP,
    cartItems
  );
  const {
    postDescription,
    postLoading,
    handlePostDescription,
    textElement,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGif,
    handleGifSubmit,
    handleSetGif,
    results,
    setGifOpen,
    gifOpen,
    handleKeyDownDelete,
    handlePost,
    preElement,
    handleImagePaste,
  } = useMakePost(
    dispatch,
    address,
    publicClient,
    collectOpen,
    postImagesDispatched,
    collectModuleType,
    lensPost.value
  );
  const { questSignUpLoading, signUpForQuest } = useQuest(
    client,
    dispatch,
    address,
    publicClient,
    connectedPKP,
    questPoints,
    isSubscribed
  );
  const {
    collectNotif,
    referral,
    setCollectible,
    collectibleDropDown,
    setCollectibleDropDown,
    collectible,
    setAudienceDropDown,
    audienceType,
    audienceTypes,
    chargeCollect,
    limit,
    limitedEdition,
    audienceDropDown,
    setAudienceType,
    setTimeLimit,
    timeLimit,
    timeLimitDropDown,
    setTimeLimitDropDown,
    setLimitedEdition,
    limitedDropDown,
    setLimitedDropDown,
    setReferral,
    setLimit,
    setChargeCollect,
    setCurrencyDropDown,
    chargeCollectDropDown,
    setChargeCollectDropDown,
    enabledCurrencies,
    enabledCurrency,
    currencyDropDown,
    setEnabledCurrency,
    value,
    setValue,
  } = useCollectOptions(dispatch, lensProfile, collectOpen);
  const { handlePromptChoose, handleSearchSimilar } = useRollSearch(
    dispatch,
    isConnected,
    address,
    chainNetwork,
    algolia,
    cartItems
  );
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const {
    collectInfoLoading: controlsCollectInfoLoading,
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
    approvalLoading,
    approveCurrency,
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
    purchaseModal,
    approvalArgs,
    fullScreenVideo,
    videoSync,
    seek,
    commentId,
    indexModal
  );
  const {
    fetchMoreVideos,
    videoLoading: channelVideoLoading,
    setVideoLoading,
  } = useChannels(
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
  } = useInteractions(lensProfile, mainVideo, commentId, indexModal);
  const {
    reacters,
    mirrorers,
    collectors,
    getMorePostCollects,
    getMorePostMirrors,
    getMorePostReactions,
    mirrorInfoLoading,
    reactInfoLoading,
    collectInfoLoading,
    hasMoreReact,
    hasMoreCollect,
    hasMoreMirror,
  } = useWho(reaction);
  const {
    profile,
    followProfile,
    followLoading,
    approved,
    approveCurrency: approveFollowCurrency,
  } = useFollowers(
    dispatch,
    publicClient,
    address,
    lensProfile,
    followersModal,
    approvalArgs
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
          videoLoading={channelVideoLoading}
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
      {reaction.open && (
        <Who
          accounts={
            reaction.type === "heart"
              ? reacters
              : reaction.type === "mirror"
              ? mirrorers
              : collectors
          }
          fetchMore={
            reaction.type === "heart"
              ? getMorePostReactions
              : reaction.type === "mirror"
              ? getMorePostMirrors
              : getMorePostCollects
          }
          loading={
            reaction.type === "heart"
              ? reactInfoLoading
              : reaction.type === "mirror"
              ? mirrorInfoLoading
              : collectInfoLoading
          }
          dispatch={dispatch}
          hasMore={
            reaction.type === "heart"
              ? hasMoreReact
              : reaction.type === "mirror"
              ? hasMoreMirror
              : hasMoreCollect
          }
          type={
            reaction.type === "heart" ? 0 : reaction.type === "collect" ? 1 : 2
          }
        />
      )}
      {purchaseModal?.open && (
        <Purchase
          dispatch={dispatch}
          collectInfoLoading={controlsCollectInfoLoading}
          approvalLoading={approvalLoading}
          address={address}
          collectModuleValues={collectModuleValues}
          lensProfile={lensProfile?.id}
          collectComment={collectVideo}
          collectLoading={collectCommentLoading[purchaseModal?.index!]}
          approveCurrency={approveCurrency}
          handleLensSignIn={handleLensSignIn}
          commentId={purchaseModal?.id}
          openConnectModal={openConnectModal}
        />
      )}
      {followersModal?.open && (
        <FollowerOnly
          profile={profile}
          followProfile={followProfile}
          followLoading={followLoading}
          approved={approved}
          approveCurrency={approveFollowCurrency}
          dispatch={dispatch}
          followDetails={followersModal}
        />
      )}
      {noHandle.value && <NoHandle dispatch={dispatch} />}
      {lensPost.value && (
        <PostBox
          dispatch={dispatch}
          handlePost={handlePost}
          postDescription={postDescription}
          textElement={textElement}
          handlePostDescription={handlePostDescription}
          postLoading={postLoading}
          caretCoord={caretCoord}
          mentionProfiles={mentionProfiles}
          profilesOpen={profilesOpen}
          handleMentionClick={handleMentionClick}
          handleGifSubmit={handleGifSubmit}
          handleGif={handleGif}
          results={results}
          handleSetGif={handleSetGif}
          gifOpen={gifOpen}
          setGifOpen={setGifOpen}
          handleKeyDownDelete={handleKeyDownDelete}
          handleRemoveImage={handleRemoveImage}
          videoLoading={videoLoading}
          uploadImages={uploadImage}
          uploadVideo={uploadVideo}
          imageLoading={imageLoading}
          mappedFeaturedFiles={mappedFeaturedFiles}
          collectOpen={collectOpen}
          enabledCurrencies={enabledCurrencies}
          audienceDropDown={audienceDropDown}
          audienceType={audienceType}
          setAudienceDropDown={setAudienceDropDown}
          setAudienceType={setAudienceType}
          value={value}
          setChargeCollect={setChargeCollect}
          setChargeCollectDropDown={setChargeCollectDropDown}
          setCollectible={setCollectible}
          setCollectibleDropDown={setCollectibleDropDown}
          setCurrencyDropDown={setCurrencyDropDown}
          setEnabledCurrency={setEnabledCurrency}
          setLimit={setLimit}
          setLimitedDropDown={setLimitedDropDown}
          setLimitedEdition={setLimitedEdition}
          setReferral={setReferral}
          setTimeLimit={setTimeLimit}
          setTimeLimitDropDown={setTimeLimitDropDown}
          setValue={setValue}
          enabledCurrency={enabledCurrency}
          chargeCollect={chargeCollect}
          chargeCollectDropDown={chargeCollectDropDown}
          limit={limit}
          limitedDropDown={limitedDropDown}
          limitedEdition={limitedEdition}
          timeLimit={timeLimit}
          timeLimitDropDown={timeLimitDropDown}
          audienceTypes={audienceTypes}
          referral={referral}
          collectNotif={collectNotif}
          collectible={collectible}
          collectibleDropDown={collectibleDropDown}
          currencyDropDown={currencyDropDown}
          postImagesDispatched={postImagesDispatched}
          preElement={preElement}
          handleImagePaste={handleImagePaste}
        />
      )}
      {messageModal?.open && (
        <Messages message={messageModal.message} dispatch={dispatch} />
      )}
      {generalModal?.open && (
        <General message={generalModal.message} dispatch={dispatch} />
      )}
      {indexModal?.value && (
        <Index
          message={indexModal?.message}
          distanceFromBottom={distanceFromBottom}
        />
      )}
      {apiAdd?.open && <ApiAdd dispatch={dispatch} />}
      {searchExpand?.value && (
        <SearchExpand
          searchItem={searchExpand?.value}
          dispatch={dispatch}
          cartItems={cartItems}
          preRolls={preRolls}
          handlePromptChoose={handlePromptChoose}
          handleSearchSimilar={handleSearchSimilar}
          router={router}
          cartAddAnim={cartAddAnim}
        />
      )}
      {imageModal?.value && (
        <ImageLarge mainImage={imageModal.image} dispatch={dispatch} />
      )}
      {questPrelude?.open && (
        <QuestPrelude
          questSignUpLoading={questSignUpLoading}
          signUpForQuest={signUpForQuest}
          openChainModal={openChainModal}
          chain={chain}
          connected={connected}
          dispatch={dispatch}
          isSubscribed={isSubscribed}
          connectedPKP={currentPKP?.ethAddress}
        />
      )}
      {login?.open && (
        <Login
          loginLoading={loginLoading}
          openConnectModal={openConnectModal}
          dispatch={dispatch}
          loginWithWeb2Auth={loginWithWeb2Auth}
          currentPKP={currentPKP}
          highlight={login.highlight}
        />
      )}
    </>
  );
};

export default Modals;
