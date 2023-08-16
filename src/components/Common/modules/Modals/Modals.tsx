import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import General from "./General";
import PostBox from "./PostBox";
import NoHandle from "./NoHandle";
import useImageUpload from "../../hooks/useImageUpload";
import useCollectOptions from "../../hooks/useCollectOptions";
import useMakePost from "../../hooks/useMakePost";
import Index from "./Index";
import { useEffect, useState } from "react";
import ImageLarge from "./ImageLarge";
import Messages from "./Messages";
import SearchExpand from "./SearchExpand";
import useRollSearch from "@/components/Layout/hooks/useRollSearch";
import ApiAdd from "./ApiAdd";
import { useRouter } from "next/router";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Login from "./Login";
import useLogin from "@/components/Layout/hooks/useLogin";
import QuestPrelude from "./QuestPrelude";
import useQuest from "@/components/Quests/hooks/useQuest";

const Modals = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const generalModal = useSelector(
    (state: RootState) => state.app.modalOpenReducer
  );
  const isSubscribed = useSelector(
    (state: RootState) => state.app.allSubscriptionsReducer.value?.isSubscribed
  );
  const questPrelude = useSelector(
    (state: RootState) => state.app.questPreludeReducer
  );
  const messageModal = useSelector(
    (state: RootState) => state.app.messagesModalReducer
  );
  const currentPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );
  const searchExpand = useSelector(
    (state: RootState) => state.app.searchExpandReducer
  );
  const connected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
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
  const imageModal = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const apiAdd = useSelector((state: RootState) => state.app.apiAddReducer);
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const noHandle = useSelector((state: RootState) => state.app.noHandleReducer);
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

  const {
    videoLoading,
    uploadImage,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
  } = useImageUpload();
  const { loginWithWeb2Auth, loginLoading } = useLogin();
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
  } = useMakePost();
  const { questSignUpLoading, signUpForQuest } = useQuest();
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
  } = useCollectOptions();
  const { handlePromptChoose, handleSearchSimilar } = useRollSearch();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  return (
    <>
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
