import { CHROMADIN } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import {
  MainContentFocus,
  PageSize,
  Post,
  PostType,
} from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Draggable from "react-draggable";

const useVideo = () => {
  const context = useContext(ModalContext);
  const videoRef = useRef<null | HTMLVideoElement>(null);
  const wrapperRef = useRef<Draggable | null>(null);
  const [videoLoading, setVideoLoading] = useState<{
    play: boolean;
    next: boolean;
    videos: boolean;
  }>({
    play: false,
    next: false,
    videos: false,
  });

  const handlePlayPause = async (): Promise<void> => {
    if (videoLoading?.play) return;
    setVideoLoading((prev) => ({
      ...prev,
      play: true,
    }));
    try {
      const video = videoRef?.current;
      if (video && video.readyState >= 3) {
        if (video?.paused) {
          await video.play();
          context?.setFullScreenVideo((prev) => ({
            ...prev,
            isPlaying: true,
          }));
        } else {
          video.pause();
          context?.setFullScreenVideo((prev) => ({
            ...prev,
            isPlaying: false,
          }));
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading((prev) => ({
      ...prev,
      play: false,
    }));
  };

  const handleSeek = (e: MouseEvent<HTMLDivElement>): void => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekFraction = (e.clientX - progressRect.left) / progressRect.width;

    const video = videoRef?.current;

    if (video && Number.isFinite(video.duration)) {
      const seekTime = seekFraction * video.duration;
      if (Number.isFinite(seekTime)) {
        video.currentTime = seekTime;
      }
    }
  };

  const handleNextVideo = async (forward: boolean): Promise<void> => {
    setVideoLoading((prev) => ({
      ...prev,
      next: true,
    }));
    try {
      if (
        forward &&
        Number(context?.fullScreenVideo?.index) + 1 >=
          Number(context?.fullScreenVideo?.allVideos?.length)
      ) {
        await getVideos(Number(context?.fullScreenVideo?.index) + 1);
      } else {
        let index = Number(context?.fullScreenVideo?.index);

        if (forward) {
          index = index + 1;
        } else {
          if (index - 1 < 0) {
            index = Number(context?.fullScreenVideo?.allVideos?.length) - 1;
          } else {
            index = index - 1;
          }
        }

        context?.setFullScreenVideo((prev) => ({
          ...prev,
          index,
          time: 0,
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading((prev) => ({
      ...prev,
      next: false,
    }));
  };
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const video = videoRef?.current;
    const newVolume = parseFloat(e.target.value);
    if (Number.isFinite(newVolume) && video) {
      video.volume = newVolume;
    }
  };

  const getVideos = async (newIndex?: number): Promise<void> => {
    setVideoLoading((prev) => ({
      ...prev,
      videos: true,
    }));
    try {
      const data = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          cursor: context?.fullScreenVideo?.cursor,
          filter: {
            postTypes: [PostType.Root],
            authors: [CHROMADIN],
            metadata: {
              mainContentFocus: [MainContentFocus.Video],
            },
          },
          pageSize: PageSize.Ten,
        }
      );

      if (data.isOk()) {
        context?.setFullScreenVideo((prev) => ({
          ...prev,
          time: 0,
          allVideos: [
            ...prev?.allVideos,
            ...((data?.value?.items || []) as Post[]),
          ],
          cursor: data?.value?.pageInfo?.next!,
          index: newIndex ? newIndex : 0,
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading((prev) => ({
      ...prev,
      videos: false,
    }));
  };

  useEffect(() => {
    if (
      Number(context?.fullScreenVideo?.allVideos?.length) < 1 &&
      context?.fullScreenVideo?.open &&
      context?.clienteLens
    ) {
      getVideos();
    }
  }, [context?.fullScreenVideo?.open, context?.clienteLens]);

  return {
    videoRef,
    videoLoading,
    handleNextVideo,
    handlePlayPause,
    handleSeek,
    handleVolumeChange,
    wrapperRef,
  };
};

export default useVideo;
