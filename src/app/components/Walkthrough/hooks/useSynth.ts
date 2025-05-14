import { ModalContext, ScrollContext, SynthContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import {
  ElementInterface,
  InputTypeVenice,
  SvgPatternType,
} from "../types/walkthrough.types";
import drawPatternElement from "@/app/lib/helpers/drawPatternElement";
import drawElement from "@/app/lib/helpers/drawElement";
import { getRegionOfInterest } from "@/app/lib/helpers/getRegionOfInterest";
import { MODELS, NEGATIVE_PROMPT, STYLE_PRESETS } from "@/app/lib/constants";

const useSynth = (dict: any) => {
  const context = useContext(ModalContext);
  const scrollContext = useContext(ScrollContext);
  const synthContext = useContext(SynthContext);
  const [synthProgress, setSynthProgress] = useState<number>(0);
  const [synthLoading, setSynthLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<{
    controlType: number;
    model: string;
    stylePreset: string;
  }>({
    controlType: 0.7,
    model: MODELS[0],
    stylePreset: STYLE_PRESETS[0],
  });

  const handleSynth = async () => {
    if (!context?.apiKey) {
      context?.setOpenAPIKey(true);

      return;
    }
    if (
      synthContext?.synthConfig.type === "img2img" &&
      !synthContext?.synthConfig.image
    ) {
      return;
    }
    setSynthLoading(true);
    try {
      let patternImg: string | undefined = undefined;
      let img: string | undefined = undefined;
      let input: InputTypeVenice;
      if (synthContext?.synthConfig.type === "img2img") {
        const reader = new FileReader();
        img = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(synthContext?.synthConfig.image as any);
        });

        input = {
          // init_images: [img!],
          model: config?.model,
          prompt: synthContext?.synthConfig.prompt,
          width: 768,
          height: 768,
          steps: 25,
          hide_watermark: true,
          return_binary: false,
          cfg_scale: 3.5,
          style_preset: config?.stylePreset,
          negative_prompt: NEGATIVE_PROMPT,
          safe_mode: false,
        };
      } else {
        if (Number(synthContext?.elements.length) > 1) {
          const region = getRegionOfInterest(synthContext?.elements[0]);
          if (region) {
            const scale = 8;
            const originalCanvas = document.createElement("canvas");
            originalCanvas.width =
              Number(synthContext?.canvasSize.width) * scale;
            originalCanvas.height =
              Number(synthContext?.canvasSize.height) * scale;
            const originalCtx = originalCanvas.getContext("2d");

            const scaleFactorWidth =
              originalCanvas.width / Number(synthContext?.canvasSize.width);
            const scaleFactorHeight =
              originalCanvas.height / Number(synthContext?.canvasSize.height);
            const scaleFactor = Math.sqrt(scaleFactorWidth * scaleFactorHeight);
            synthContext?.elements
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
          // init_images: patternImg ? [patternImg] : undefined,
          model: config?.model,
          prompt: synthContext?.synthConfig.prompt!,
          width: 768,
          height: 768,
          steps: 25,
          hide_watermark: true,
          return_binary: false,
          cfg_scale: 3.5,
          style_preset: config?.stylePreset,
          negative_prompt: NEGATIVE_PROMPT,
          safe_mode: false,
        };
      }

      await promptToVenice(input);
    } catch (err: any) {
      console.error(err.message);
    }
    setSynthLoading(false);
  };

  const scrollToComposite = () => {
    if (!scrollContext?.compositeRef || !scrollContext?.compositeRef?.current)
      return;

    scrollContext?.compositeRef?.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      scrollContext.compositeRef.current!.scrollTop =
        scrollContext?.compositeRef.current!.scrollHeight;
    }, 500);
  };

  const promptToVenice = async (input: InputTypeVenice): Promise<void> => {
    try {
      const response = await fetch("/api/venice", {
        method: "POST",
        body: JSON.stringify(input),
      });

      const responseJSON = await response.json();

      if (responseJSON === null || !responseJSON) {
        context?.setModalOpen(dict?.Common?.salio);
      } else {
        let newCompletedSynths = new Map(
          synthContext?.current?.completedSynths
        );
        newCompletedSynths.set(String(synthContext?.current?.layer?.id), {
          synths: [
            ...(synthContext?.current?.completedSynths?.get(
              String(synthContext?.current?.layer?.id)
            )?.synths || [])!,
            ...responseJSON.json.images,
          ],
          chosen: synthContext?.current?.completedSynths?.get(
            String(synthContext?.current?.layer?.id)
          )?.chosen
            ? synthContext?.current?.completedSynths?.get(
                String(synthContext?.current?.layer?.id)
              )?.chosen
            : responseJSON.json.images[responseJSON.json.images.length - 1],
        });
        synthContext?.setCurrent((prev) => ({
          ...prev,
          completedSynths: newCompletedSynths,
        }));
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
              setSynthProgress(responseJSON.json.progress);
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
    scrollToComposite,
    handleDownloadImage,
    config,
    setConfig,
    synthLoading,
    synthProgress,
  };
};

export default useSynth;
