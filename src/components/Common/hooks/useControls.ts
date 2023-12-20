import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { PublicClient } from "wagmi";
import ReactPlayer from "react-player";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import useInteractionsPlayer from "./useInteractionsPlayer";
import { FetchResult } from "@apollo/client";
import {
  AddReactionMutation,
  Profile,
  PublicationReactionType,
} from "../types/generated";
import { setReactId } from "../../../../redux/reducers/reactIdSlice";
import {
  IndexModalState,
  setIndexModal,
} from "../../../../redux/reducers/indexModalSlice";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import { setVideoSync } from "../../../../redux/reducers/videoSyncSlice";
import { setSeek } from "../../../../redux/reducers/seekSlice";
import mirrorSig from "../../../../lib/lens/helpers/mirrorSig";
import actSig from "../../../../lib/lens/helpers/actSig";
import { AnyAction, Dispatch } from "redux";
import {  VideoSyncState } from "../types/common.types";
import { MainVideoState } from "../../../../redux/reducers/mainVideoSlice";
import { VideoPlayerState } from "../../../../redux/reducers/videoPlayerSlice";
import likePost from "../../../../graphql/lens/mutations/like";

const useControls = (
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  profile: Profile | undefined,
  mainVideo: MainVideoState,  fullScreenVideo: VideoPlayerState,
  videoSync: VideoSyncState,
  seek: number,
  commentId: string,
  index: IndexModalState
) => {
  const streamRef = useRef<ReactPlayer>(null);
  const { commentors } = useInteractionsPlayer(
    profile,
    mainVideo,
    commentId,
    index
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fullVideoRef = useRef<ReactPlayer>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState<number>(1);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [mirrorLoading, setMirrorLoading] = useState<boolean>(false);
  const [mirrorCommentLoading, setMirrorCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const [likeCommentLoading, setLikeCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );
  const [collectCommentLoading, setCollectCommentLoading] = useState<boolean[]>(
    Array.from({ length: commentors?.length }, () => false)
  );

  const handleHeart = () => {
    dispatch(
      setVideoSync({
        actionHeart: true,
        actionDuration: videoSync.duration,
        actionCurrentTime: videoSync.currentTime,
        actionIsPlaying: videoSync.isPlaying,
        actionLikedArray: videoSync.likedArray,
        actionMirroredArray: videoSync.mirroredArray,
        actionCollectedArray: videoSync.collectedArray,
        actionVideosLoading: videoSync.videosLoading,
      })
    );
    setTimeout(() => {
      dispatch(
        setVideoSync({
          actionHeart: false,
          actionDuration: videoSync.duration,
          actionCurrentTime: videoSync.currentTime,
          actionIsPlaying: videoSync.isPlaying,
          actionLikedArray: videoSync.likedArray,
          actionMirroredArray: videoSync.mirroredArray,
          actionCollectedArray: videoSync.collectedArray,
          actionVideosLoading: videoSync.videosLoading,
        })
      );
    }, 3000);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleVolumeChange = (e: FormEvent) => {
    setVolume(parseFloat((e.target as HTMLFormElement).value));
  };

  const likeVideo = async (id?: string): Promise<void> => {
    let index: number, react: FetchResult<AddReactionMutation>;
    if (!id) {
      setLikeLoading(true);
      dispatch(setReactId(mainVideo.id));
    } else {
      index = commentors?.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setLikeCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
      setLikeLoading(true);
    }
    if (!profile?.id) {
      setLikeLoading(false);
      if (index! >= 0) {
        setLikeCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      react = await likePost({
        for: id ? id : mainVideo?.id,
        reaction: PublicationReactionType.Upvote,
      });
    } catch (err: any) {
      setLikeLoading(false);
      console.error(err.message);
    }
    if (!id) {
      setLikeLoading(false);
    } else {
      setLikeCommentLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Successfully Indexed",
      })
    );
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 4000);
  };

  const mirrorVideo = async (id?: string): Promise<void> => {
    let index: number;

    if (!id) {
      setMirrorLoading(true);
      dispatch(setReactId(mainVideo.id));
    } else {
      index = commentors.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setMirrorCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }

    if (!profile?.id) {
      setMirrorLoading(false);
      if (index! >= 0) {
        setMirrorCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await mirrorSig(
        id ? id : mainVideo.id,
        clientWallet,
        publicClient,
        address as `0x${string}`,
        dispatch
      );
    } catch (err: any) {
      console.error(err.message);
    }
    if (!id) {
      setMirrorLoading(false);
    } else {
      setMirrorCommentLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index] = false;
        return updatedArray;
      });
    }
  };

  const collectVideo = async (id?: string): Promise<void> => {
    let index: number;
    if (!id) {
      setCollectLoading(true);
      dispatch(setReactId(mainVideo.id));
    } else {
      index = commentors.findIndex((commentor) => commentor.id === id);
      if (index >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = true;
          return updatedArray;
        });
      }
    }

    if (!profile?.id) {
      setCollectLoading(false);
      if (index! >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
      return;
    }
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await actSig(
        id ? id : mainVideo.id,
        {
          simpleCollectOpenAction: true,
        },
        clientWallet,
        publicClient,
        address as `0x${string}`,
        dispatch
      );
    } catch (err: any) {
      setCollectLoading(false);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModalOpen({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Collect.",
          })
        );
      }
      console.error(err.message);
    }
    if (!id) {
      setCollectLoading(false);
    } else {
      if (index! >= 0) {
        setCollectCommentLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index] = false;
          return updatedArray;
        });
      }
    }
  };

  const handleSeek = (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;
    // setCurrentTime(seekPosition * duration);
    dispatch(setSeek(seekPosition));
    streamRef.current?.seekTo(seekPosition, "fraction");
  };

  useEffect(() => {
    if (seek !== 0) {
      fullVideoRef?.current?.seekTo(seek, "fraction");
    }
  }, [seek]);

  useEffect(() => {
    if (fullScreenVideo.open) {
      dispatch(
        setVideoSync({
          actionHeart: videoSync.heart,
          actionDuration: videoSync.duration,
          actionCurrentTime: videoSync.currentTime,
          actionIsPlaying: false,
          actionLikedArray: videoSync.likedArray,
          actionMirroredArray: videoSync.mirroredArray,
          actionCollectedArray: videoSync.collectedArray,
          actionVideosLoading: videoSync.videosLoading,
        })
      );
      streamRef?.current?.seekTo(videoSync.currentTime, "seconds");
      fullVideoRef?.current?.seekTo(videoSync.currentTime, "seconds");
      setTimeout(() => {
        dispatch(
          setVideoSync({
            actionHeart: videoSync.heart,
            actionDuration: videoSync.duration,
            actionCurrentTime: videoSync.currentTime,
            actionIsPlaying: true,
            actionLikedArray: videoSync.likedArray,
            actionMirroredArray: videoSync.mirroredArray,
            actionCollectedArray: videoSync.collectedArray,
            actionVideosLoading: videoSync.videosLoading,
          })
        );
      }, 1000);
    }
  }, [fullScreenVideo.open]);

  return {
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
  };
};

export default useControls;
