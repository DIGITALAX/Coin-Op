import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useEffect, useRef } from "react";
import { setCompletedSynths } from "../../../../../redux/reducers/completedSynthsSlice";
import { setSynthLoading } from "../../../../../redux/reducers/synthLoadingSlice";
import { InputTypeAutomatic } from "../types/synth.types";
import { negative_prompt } from "../../../../../lib/constants";
import { setModalOpen } from "../../../../../redux/reducers/modalOpenSlice";
import { setSynthProgress } from "../../../../../redux/reducers/synthProgressSlice";

const useSynth = () => {
  const dispatch = useDispatch();
  const compositeRef = useRef<HTMLDivElement>(null);
  const synthConfig = useSelector(
    (state: RootState) => state.app.synthConfigReducer
  );
  const layerToSynth = useSelector(
    (state: RootState) => state.app.layerToSynthReducer.value
  );
  const completedSynths = useSelector(
    (state: RootState) => state.app.completedSynthsReducer.value
  );
  const synthLoading = useSelector(
    (state: RootState) => state.app.synthLoadingReducer.value
  );
  const canvasSize = useSelector(
    (state: RootState) => state.app.synthAreaReducer.value
  );

  const presets: string[] = [
    "none",
    "abstract",
    "anime",
    "synthwave",
    "street art",
    "dark fantasy",
    "floral",
    "surreal",
    "pop art",
    "portrait",
    "mix",
    "daily special",
  ];

  const handleSynth = async () => {
    if (synthConfig.type === "img2img" && !synthConfig.image) {
      return;
    }
    dispatch(setSynthLoading(true));
    try {
      let input: InputTypeAutomatic;
      if (synthConfig.type === "img2img") {
        const reader = new FileReader();
        const img: string = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(synthConfig.image as any);
        });

        input = {
          init_images: [img],
          prompt: synthConfig.prompt,
          steps: 40,
          cfg_scale: 8,
          negative_prompt: negative_prompt,
          batch_size: 1,
          image_cfg_scale: 7,
          restore_faces: true,
          seed: Math.random(),
          width: canvasSize.width,
          height: canvasSize.height,
          sampler_name: "DPM++ 2M Karras",
          sampler_index: "DPM++ 2M Karras",
          controlnet_units: [
            {
              input_image: "",
              mask: "",
              module: "none",
              model: "control_sd15_canny [fef5e48e]",
              weight: 1.6,
              resize_mode: "Scale to Fit (Inner Fit)",
              lowvram: false,
              processor_res: 512,
              threshold_a: 64,
              threshold_b: 64,
              guidance: 1,
              guidance_start: 0,
              guidance_end: 1,
              guessmode: true,
            },
          ],
        };
      } else {
        input = {
          prompt: synthConfig.prompt,
          steps: 40,
          cfg_scale: 8,
          negative_prompt: negative_prompt,
          batch_size: 1,
          restore_faces: true,
          seed: Math.random(),
          width: canvasSize.width,
          height: canvasSize.height,
          sampler_name: "DPM++ 2M Karras",
          sampler_index: "DPM++ 2M Karras",
          controlnet_units: [
            {
              input_image: "",
              mask: "",
              module: "none",
              model: "control_sd15_canny [fef5e48e]",
              weight: 1.6,
              resize_mode: "Scale to Fit (Inner Fit)",
              lowvram: false,
              processor_res: 512,
              threshold_a: 64,
              threshold_b: 64,
              guidance: 1,
              guidance_start: 0,
              guidance_end: 1,
              guessmode: true,
            },
          ],
        };
      }

      await promptToAutomatic(
        input,
        synthConfig.type === "img2img" ? "sdapi/v1/img2img" : "sdapi/v1/txt2img"
      );
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setSynthLoading(false));
  };

  const scrollToComposite = () => {
    if (!compositeRef || !compositeRef?.current) return;

    compositeRef?.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      compositeRef.current!.scrollTop = compositeRef.current!.scrollHeight;
    }, 500);
  };

  const promptToAutomatic = async (
    input: InputTypeAutomatic,
    path: string
  ): Promise<void> => {
    try {
      const response = await fetch("/api/automatic/synth", {
        method: "POST",
        body: JSON.stringify({
          input,
          path,
        }),
      });
      const responseJSON = await response.json();
      if (responseJSON === null || !responseJSON) {
        dispatch(
          setModalOpen({
            actionOpen: false,
            actionMessage:
              "Something went wrong generating your synth, try again?",
          })
        );
      } else {
        let newCompletedSynths = new Map(completedSynths);
        newCompletedSynths.set(String(layerToSynth.id), {
          synths: [
            ...(completedSynths.get(String(layerToSynth.id))?.synths || [])!,
            ...responseJSON.json.images,
          ],
          chosen: completedSynths.get(String(layerToSynth.id))?.chosen
            ? completedSynths.get(String(layerToSynth.id))?.chosen
            : responseJSON.json.images[responseJSON.json.images.length - 1],
        });
        dispatch(setCompletedSynths(newCompletedSynths));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleDownloadImage = () => {
    const imgElement = document.getElementById("base64Img") as HTMLImageElement;
    const originalWidth = imgElement.naturalWidth;
    const originalHeight = imgElement.naturalHeight;

    let newWidth = originalWidth;
    let newHeight = originalHeight;

    const minWidth = 768;
    const minHeight = 768;

    if (originalWidth < minWidth || originalHeight < minHeight) {
      const aspectRatio = originalWidth / originalHeight;
      if (originalWidth < minWidth) {
        newWidth = minWidth;
        newHeight = newWidth / aspectRatio;
      }
      if (newHeight < minHeight) {
        newHeight = minHeight;
        newWidth = newHeight * aspectRatio;
      }
    }

    const newCanvas = document.createElement("canvas");
    newCanvas.width = newWidth;
    newCanvas.height = newHeight;

    const newCtx = newCanvas.getContext("2d");
    if (newCtx) {
      newCtx.drawImage(imgElement, 0, 0, newWidth, newHeight);
      const downloadLink = document.createElement("a");
      downloadLink.href = newCanvas.toDataURL();
      downloadLink.download = "coin-op-synth";
      downloadLink.click();
    }
  };

  const checkSynthProgress = async (): Promise<void> => {
    try {
      if (synthLoading) {
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        while (true) {
          const response = await fetch("/api/automatic/progress", {
            method: "GET",
          });
          if (response) {
            const responseJSON = await response.json();
            if (responseJSON) {
              dispatch(setSynthProgress(responseJSON.json.progress));
              if (responseJSON.json.progress.toFixed(1) === "1") {
                return;
              }
            }
          }

          await delay(5000);
        }
      }
    } catch (err: any) {
      console.error(err, "here");
    }
  };

  useEffect(() => {
    checkSynthProgress();
  }, [synthLoading]);

  return {
    handleSynth,
    presets,
    scrollToComposite,
    compositeRef,
    handleDownloadImage,
  };
};

export default useSynth;
