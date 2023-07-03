import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lodash from "lodash";
import { RootState } from "../../../../redux/store";
import { MediaType, UploadedMedia } from "../types/common.types";
import { getPostData, setPostData } from "../../../../lib/lens/utils";
import { setImageLoading } from "../../../../redux/reducers/imageLoadingSlice";
import { setPostImages } from "../../../../redux/reducers/postImagesSlice";

const useImageUpload = () => {
  const postOpen = useSelector(
    (state: RootState) => state.app.lensPostBoxReducer.value
  );
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<
    UploadedMedia[]
  >(JSON.parse(getPostData() || "{}").images || []);
  const dispatch = useDispatch();
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.postImagesReducer.value
  );

  const uploadImage = async (
    e: FormEvent | File[],
    pasted?: boolean
  ): Promise<void> => {
    if (!pasted) {
      if ((e as any)?.target?.files?.length < 1) {
        return;
      }
    } else {
      if ((e as File[]).length < 1) {
        return;
      }
    }
    let finalImages: UploadedMedia[] = [];
    dispatch(setImageLoading(true));
    // if (
    //   fileLimitAlert(pasted ? (e as File[])[0] : (e as any).target.files[0])
    // ) {
    //   setImageLoading(false);
    //   return;
    // }
    let uploadCounter = 0; // add a counter here
    const numberOfFiles = pasted
      ? (e as File[]).length
      : (e as any).target.files.length;

    const imageFiles = Array.from(
      pasted
        ? (e as File[])
        : ((e as FormEvent).target as HTMLFormElement)?.files
    );

    await Promise.all(
      imageFiles.map(async (_, index: number) => {
        try {
          // const compressedImage = await compressImageFiles(
          //   (e as any).target.files[index] as File
          // );
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: pasted
              ? (e as File[])[index]
              : (e as any).target.files[index],
          });
          if (response.status !== 200) {
            dispatch(setImageLoading(false));
            return;
          } else {
            let cid = await response.json();
            finalImages.push({
              cid: String(cid?.cid),
              type: MediaType.Image,
            });
            uploadCounter += 1; // increment counter here

            if (uploadCounter === numberOfFiles) {
              // check counter here
              dispatch(setImageLoading(false));
            }
            if (
              finalImages?.length ===
              (pasted
                ? (e as File[]).length
                : ((e as FormEvent).target as HTMLFormElement).files?.length)
            ) {
              let newArr = [...imagesUploaded, ...finalImages];
              setMappedFeaturedFiles(newArr);
              const postStorage = JSON.parse(getPostData() || "{}");
              setPostData(
                JSON.stringify({
                  ...postStorage,
                  images: newArr,
                })
              );
            }
          }
        } catch (err: any) {
          console.error(err.message);
          dispatch(setImageLoading(false));
        }
      })
    );
  };

  const uploadVideo = async (e: FormEvent, feed?: boolean) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      // if (videoLimitAlert((e as any).target.files[0])) {
      //   return;
      // }
      setVideoLoading(true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      let newArr = [
        ...imagesUploaded,
        { cid: String(cid?.cid), type: MediaType.Video },
      ];
      setMappedFeaturedFiles(newArr);

      const postStorage = JSON.parse(getPostData() || "{}");
      setPostData(
        JSON.stringify({
          ...postStorage,
          images: newArr,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading(false);
  };

  const handleRemoveImage = (image: UploadedMedia, feed?: boolean): void => {
    const cleanedArray = lodash.filter(
      imagesUploaded,
      (uploaded) => uploaded.cid !== image.cid
    );
    setMappedFeaturedFiles(cleanedArray);

    const postStorage = JSON.parse(getPostData() || "{}");
    setPostData(
      JSON.stringify({
        ...postStorage,
        images: cleanedArray,
      })
    );
  };

  useEffect(() => {
    if (postOpen) {
      if (mappedFeaturedFiles.length > 3) {
        setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
        dispatch(setPostImages(mappedFeaturedFiles.slice(0, 4)));
      } else {
        dispatch(setPostImages(mappedFeaturedFiles));
      }
    }
  }, [mappedFeaturedFiles]);

  return {
    uploadImage,
    mappedFeaturedFiles,
    handleRemoveImage,
    videoLoading,
    uploadVideo,
  };
};

export default useImageUpload;
