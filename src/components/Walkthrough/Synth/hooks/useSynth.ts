import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useEffect, useRef, useState } from "react";
import { setCompletedSynths } from "../../../../../redux/reducers/completedSynthsSlice";
import { setSynthLoading } from "../../../../../redux/reducers/synthLoadingSlice";
import {
  ElementInterface,
  InputTypeAutomatic,
  SvgPatternType,
} from "../types/synth.types";
import { negative_prompt } from "../../../../../lib/constants";
import { setModalOpen } from "../../../../../redux/reducers/modalOpenSlice";
import { setSynthProgress } from "../../../../../redux/reducers/synthProgressSlice";
import drawElement from "../../../../../lib/canvas/helpers/drawElement";
import drawPatternElement from "../../../../../lib/canvas/helpers/drawPatternElement";
import { getRegionOfInterest } from "../../../../../lib/canvas/helpers/getRegionOfInterest";
import { setApiAdd } from "../../../../../redux/reducers/apiAddSlice";

const useSynth = () => {
  const dispatch = useDispatch();
  const compositeRef = useRef<HTMLDivElement>(null);
  const synthConfig = useSelector(
    (state: RootState) => state.app.synthConfigReducer
  );
  const apiKey = useSelector((state: RootState) => state.app.apiAddReducer);
  const elements = useSelector(
    (state: RootState) => state.app.setElementsReducer.value
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
  const [controlType, setControlType] = useState<number>(0.7);
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
    if (!apiKey.key) {
      dispatch(
        setApiAdd({
          actionKey: undefined,
          actionOpen: true,
        })
      );
      return;
    }
    if (synthConfig.type === "img2img" && !synthConfig.image) {
      return;
    }
    dispatch(setSynthLoading(true));
    try {
      let input: InputTypeAutomatic;
      let patternImg: string | undefined = undefined;
      let img: string | undefined = undefined;
      if (synthConfig.type === "img2img") {
        const reader = new FileReader();
        img = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(synthConfig.image as any);
        });

        input = {
          init_images: [img!],
          prompt: synthConfig.prompt,
          steps: 40,
          cfg_scale: 8,
          negative_prompt: negative_prompt,
          batch_size: 1,
          image_cfg_scale: 7,
          restore_faces: true,
          seed: Math.floor(Math.random() * (1e10 - 1e9) + 1e9),
          width: canvasSize.width,
          height: canvasSize.height,
          sampler_name: "DPM++ 2M Karras",
          sampler_index: "DPM++ 2M Karras",
        };
      } else {
        if (elements.length > 1) {
          const region = getRegionOfInterest(elements[0]);
          if (region) {
            const scale = 8;
            const originalCanvas = document.createElement("canvas");
            originalCanvas.width = canvasSize.width * scale;
            originalCanvas.height = canvasSize.height * scale;
            const originalCtx = originalCanvas.getContext("2d");

            const scaleFactorWidth = originalCanvas.width / canvasSize.width;
            const scaleFactorHeight = originalCanvas.height / canvasSize.height;
            const scaleFactor = Math.sqrt(scaleFactorWidth * scaleFactorHeight);
            elements
              .slice(1)
              .forEach((element: ElementInterface | SvgPatternType) => {
                let newElement;
                if (element.type === "image") {
                  newElement = {
                    ...element,
                    width: element.width! * scaleFactor,
                    height: element.height! * scaleFactor,
                  };
                } else if (element.type === "text") {
                  newElement = {
                    ...element,
                    x1: element.x1! * scaleFactorWidth,
                    x2: element.x2! * scaleFactorWidth,
                    y1: element.y1! * scaleFactorHeight,
                    y2: element.y2! * scaleFactorHeight,
                    strokeWidth: element.strokeWidth! * scaleFactor,
                  };
                } else {
                  newElement = {
                    ...element,
                    strokeWidth: element.strokeWidth! * scaleFactor,
                    points: (element as ElementInterface).points?.map(
                      (point: { x: number; y: number }) => {
                        return {
                          x: point.x * scaleFactorWidth,
                          y: point.y * scaleFactorHeight,
                        };
                      }
                    ),
                  };
                }

                if (newElement.type === "image") {
                  drawPatternElement(
                    newElement as SvgPatternType,
                    originalCtx,
                    "rgba(0,0,0,0)"
                  );
                } else {
                  drawElement(
                    newElement as ElementInterface,
                    originalCtx,
                    "rgba(0,0,0,0)",
                    true
                  );
                }
              });

            const regionCanvas = document.createElement("canvas");
            regionCanvas.width = region.width * scaleFactorWidth;
            regionCanvas.height = region.height * scaleFactorHeight;
            const regionCtx = regionCanvas.getContext("2d");
            regionCtx?.drawImage(
              originalCanvas,
              region.x * scaleFactorWidth,
              region.y * scaleFactorHeight,
              regionCanvas.width,
              regionCanvas.height,
              0,
              0,
              regionCanvas.width,
              regionCanvas.height
            );
            patternImg = regionCanvas.toDataURL();
          }
        }

        input = {
          prompt: synthConfig.prompt,
          init_images: patternImg ? [patternImg] : undefined,
          steps: 40,
          cfg_scale: 8,
          negative_prompt: negative_prompt,
          batch_size: 1,
          restore_faces: true,
          seed: Math.floor(Math.random() * (1e10 - 1e9) + 1e9),
          width: canvasSize.width,
          height: canvasSize.height,
          sampler_name: "DPM++ 2M Karras",
          sampler_index: "DPM++ 2M Karras",
        };
      }

      if (controlType > 0.4 && elements.length > 1 && patternImg) {
        input = {
          ...input,
          controlnet_units: [
            {
              input_image: synthConfig.type === "img2img" ? img! : patternImg!,
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
        synthConfig.type === "img2img" || patternImg
          ? "sdapi/v1/img2img"
          : "sdapi/v1/txt2img"
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
            actionOpen: true,
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
  const handleDownloadImage = (imageSrc: string) => {
    const imgElement = new Image();
    imgElement.src = imageSrc;

    imgElement.onload = () => {
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
    controlType,
    setControlType,
  };
};

export default useSynth;
