import {
  FormEvent,
  MouseEvent,
  WheelEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { throttle } from "lodash";
import { SynthContext } from "@/app/providers";
import lodash from "lodash";
import { ElementInterface, SvgPatternType } from "../types/walkthrough.types";
import useElements from "./useElements";
import addRashToCanvas from "@/app/lib/helpers/addRashToCanvas";
import { isPointInPattern } from "@/app/lib/helpers/isPointInPattern";
import createElement from "@/app/lib/helpers/createElement";
import updateElement from "@/app/lib/helpers/updateElement";
import wheelLogic from "@/app/lib/helpers/wheelLogic";
import { getRegionOfInterest } from "@/app/lib/helpers/getRegionOfInterest";
import drawPatternElement from "@/app/lib/helpers/drawPatternElement";
import drawElement from "@/app/lib/helpers/drawElement";

const useCanvas = (synthLoading: boolean, synthProgress: number) => {
  let animationFrameId: number | null = null;
  const synthContext = useContext(SynthContext);
  const frameId = useRef<number | null>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  }, []);
  const writingRef = useRef<HTMLTextAreaElement>(null);
  const ctx = canvas?.getContext("2d") as any;
  const { history, index, setState: setElements, undo, redo } = useElements();
  const [zoom, setZoom] = useState<number>(1);
  const [font, setFont] = useState<string>("Manaspace");
  const [fontOpen, setFontOpen] = useState<boolean>(false);
  const [materialBackground, setMaterialBackground] = useState<string>("black");
  const [itemClicked, setItemClicked] = useState<boolean>(false);
  const [materialOpen, setMaterialOpen] = useState<boolean>(false);
  const [tool, setTool] = useState<string>("default");
  const [showBottomOptions, setShowBottomOptions] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pan, setPan] = useState<{
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  }>({
    xInitial: 0,
    yInitial: 0,
    xOffset: 0,
    yOffset: 0,
  });
  const [selectedElement, setSelectedElement] =
    useState<ElementInterface | null>(null);
  const [hex, setHex] = useState<string>("#F5A623");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(3);
  const [thickness, setThickness] = useState<boolean>(false);
  const [newLayersLoading, setNewLayersLoading] = useState<boolean>(false);
  const [offsets, setOffsets] = useState<
    {
      offsetXs: number[];
      offsetYs: number[];
      offsetX: number;
      offsetY: number;
    }[]
  >([]);
  const [clear, setClear] = useState<boolean>(false);
  const [action, setAction] = useState<string>("none");

  const synthLayerSwitch = async () => {
    if (!synthContext?.current?.layer?.uri || newLayersLoading || !canvas)
      return;
    setNewLayersLoading(true);
    let addRashToCanvasPromise;
    if (!history.get(String(Number(synthContext?.current?.layer?.id)))) {
      addRashToCanvasPromise = addRashToCanvas(
        synthContext,
        setElements,
        synthContext?.current?.layer?.uri,
        Number(synthContext?.current?.layer?.id!),
        canvas!
      );
    } else {
      addRashToCanvasPromise = addRashToCanvas(
        synthContext,
        setElements,
        synthContext?.current?.layer?.uri,
        Number(synthContext?.current?.layer?.id!),
        canvas!,
        history.get(String(Number(synthContext?.current?.layer?.id))),
        synthContext?.canvasSize
      );
    }

    addRashToCanvasPromise
      .then(() => {
        setZoom(1);
        setPan({
          xInitial: 0,
          yInitial: 0,
          xOffset: 0,
          yOffset: 0,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setTimeout(() => {
          setNewLayersLoading(false);
        }, 500);
      });
  };

  const handleWheel = useCallback(
    throttle((e: WheelEvent) => {
      e.preventDefault();
      wheelLogic(
        e,
        zoom,
        setZoom,
        canvas!,
        pan,
        setPan,
        synthContext?.canvasExpand ? 30 : 14
      );
    }, 1000 / 60),
    [zoom, setZoom, canvas, pan, setPan, synthContext?.canvasExpand]
  );

  const handleMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (synthLoading) return;
    const bounds = canvas?.getBoundingClientRect();
    if (tool === "default") {
      setAction("none");
      setIsDragging(true);
      setPan({
        ...pan,
        xInitial: e.clientX - pan.xOffset,
        yInitial: e.clientY - pan.yOffset,
      });
    } else if (
      (tool === "move" || tool == "resize") &&
      isPointInPattern(
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        history.get(String(Number(synthContext?.current?.layer?.id)))?.[0] ||
          [],
        ctx,
        (
          history.get(String(Number(synthContext?.current?.layer?.id)))?.[0] ||
          []
        ).type === "circle"
          ? true
          : false
      )
    ) {
      const allElements =
        history.get(String(Number(synthContext?.current?.layer?.id))) || [];
      let newOffsets: {
        offsetXs: number[];
        offsetYs: number[];
        offsetX: number;
        offsetY: number;
      }[] = [];
      allElements.forEach((element) => {
        if (element.type === "pencil" || element.type === "erase") {
          const offsetXs = element.points?.map(
            (point: { x: number; y: number }) =>
              ((e.clientX - pan.xOffset * 0.5) * devicePixelRatio) / zoom -
              point.x
          );
          const offsetYs = element.points?.map(
            (point: { x: number; y: number }) =>
              ((e.clientY - pan.yOffset * 0.5) * devicePixelRatio) / zoom -
              point.y
          );
          newOffsets.push({
            offsetXs,
            offsetYs,
            offsetX: 0,
            offsetY: 0,
          });
        } else {
          const offsetX =
            ((e.clientX - bounds.left - pan.xOffset * 0.5) * devicePixelRatio) /
              zoom -
            (element?.x1 as number);
          const offsetY =
            ((e.clientY - bounds.top - pan.yOffset * 0.5) * devicePixelRatio) /
              zoom -
            (element?.y1 as number);
          newOffsets.push({
            offsetXs: [],
            offsetYs: [],
            offsetX,
            offsetY,
          });
        }
      });

      setOffsets(newOffsets);
      setAction(tool === "move" ? "moving" : "resizing");
    } else if (
      (tool === "pencil" || tool === "text" || tool === "erase") &&
      isPointInPattern(
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        history.get(String(Number(synthContext?.current?.layer?.id)))?.[0] ||
          [],
        ctx,
        (
          history.get(String(Number(synthContext?.current?.layer?.id)))?.[0] ||
          []
        ).type === "circle"
          ? true
          : false
      )
    ) {
      const newElement = createElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvas,
        zoom,
        e.clientX,
        e.clientY,
        e.clientX,
        e.clientY,
        tool,
        (history.get(String(Number(synthContext?.current?.layer?.id))) || [])
          .length,
        brushWidth,
        tool !== "erase" ? hex : materialBackground,
        tool !== "text" ? undefined : font
      );
      setAction(
        tool === "pencil" ? "drawing" : tool === "erase" ? "erasing" : "writing"
      );
      setSelectedElement(newElement!);
      setElements(
        String(Number(synthContext?.current?.layer?.id)),
        [
          ...(history.get(String(Number(synthContext?.current?.layer?.id))) ||
            []),
          newElement,
        ],
        false,
        false
      );
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (synthLoading) return;
    const bounds = canvas?.getBoundingClientRect();

    if (!action || action === "writing") return;
    const { clientX, clientY } = e;
    if (zoom > 1 && isDragging && tool === "default") {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = window.requestAnimationFrame(() => {
        const newXOffset = clientX - pan.xInitial;
        const newYOffset = clientY - pan.yInitial;
        setPan({
          xInitial: pan.xInitial,
          yInitial: pan.yInitial,
          xOffset: newXOffset,
          yOffset: newYOffset,
        });
      });
    } else if (
      (action === "drawing" || action === "erasing") &&
      isPointInPattern(
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        history.get(String(Number(synthContext?.current?.layer?.id)))?.[0] ||
          [],
        ctx,
        (
          history.get(String(Number(synthContext?.current?.layer?.id)))?.[0] ||
          []
        ).type === "circle"
          ? true
          : false
      )
    ) {
      setColorPicker(false);
      setFontOpen(false);
      setThickness(false);
      const index =
        (history.get(String(Number(synthContext?.current?.layer?.id))) || [])
          ?.length - 1;
      const values = (history.get(
        String(Number(synthContext?.current?.layer?.id))
      ) || [])?.[index];
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvas,
        zoom,
        history.get(String(Number(synthContext?.current?.layer?.id))) || [],
        setElements,
        String(Number(synthContext?.current?.layer?.id)),
        ctx!,
        values?.x1!,
        values?.y1!,
        e.clientX,
        e.clientY,
        tool,
        index,
        brushWidth,
        tool !== "erase" ? hex : materialBackground,
        undefined,
        undefined
      );
    } else if (action === "moving") {
      const allElements =
        history.get(String(Number(synthContext?.current?.layer?.id))) || [];
      let newElements: (SvgPatternType | ElementInterface)[] = [];
      allElements.forEach((element, index: number) => {
        if (element.type === "pencil" || element.type === "erase") {
          newElements.push({
            ...element,
            points: element.points?.map(
              (_: { x: number; y: number }, indexTwo: number) => ({
                x:
                  ((e.clientX - pan.xOffset * 0.5) / zoom) * devicePixelRatio -
                  offsets[index]?.offsetXs[indexTwo],
                y:
                  ((e.clientY - pan.yOffset * 0.5) / zoom) * devicePixelRatio -
                  offsets[index]?.offsetYs[indexTwo],
              })
            ),
          });
        } else if (element.type === "image") {
          const mouseXOnCanvas =
            ((e.clientX - bounds.left - pan.xOffset * 0.5) * devicePixelRatio) /
            zoom;
          const mouseYOnCanvas =
            ((e.clientY - bounds.top - pan.yOffset * 0.5) * devicePixelRatio) /
            zoom;
          const newX1 = mouseXOnCanvas - offsets[index].offsetX;
          const newY1 = mouseYOnCanvas - offsets[index].offsetY;
          newElements.push({
            ...element,
            xOffset: pan.xOffset * 0.5,
            yOffset: pan.yOffset * 0.5,
            x1: newX1,
            y1: newY1,
            x2: newX1 + element.width! * devicePixelRatio,
            y2: newY1 + element.height! * devicePixelRatio,
          });
        } else if (element.type === "text") {
          const textWidth = ctx?.measureText(element?.text!).width!;
          const textHeight = ctx?.measureText("M").width! / 2;

          newElements.push({
            ...element,
            x1:
              ((e.clientX - bounds.left - pan.xOffset * 0.5) *
                devicePixelRatio) /
                zoom -
              offsets[index].offsetX,
            y1:
              ((e.clientY - bounds.top - pan.yOffset * 0.5) *
                devicePixelRatio) /
                zoom -
              offsets[index].offsetY,
            x2:
              ((e.clientX - bounds.left - pan.xOffset * 0.5) *
                devicePixelRatio) /
                zoom +
              textWidth * zoom -
              offsets[index].offsetX,
            y2:
              ((e.clientY - bounds.top - pan.yOffset * 0.5) *
                devicePixelRatio) /
                zoom +
              textHeight * zoom -
              offsets[index].offsetY,
          });
        } else {
          newElements.push(element);
        }
      });
      setElements(
        String(Number(synthContext?.current?.layer?.id)),
        newElements,
        true,
        false
      );
    } else if (action === "resizing") {
      const allElements =
        history.get(String(Number(synthContext?.current?.layer?.id))) || [];
      let newElements: (SvgPatternType | ElementInterface)[] = [];
      allElements.forEach((element, index: number) => {
        if (element.type === "image") {
          const mouseXOnCanvas =
            ((e.clientX - bounds.left - pan.xOffset * 0.5) * devicePixelRatio) /
            zoom;
          const mouseYOnCanvas =
            ((e.clientY - bounds.top - pan.yOffset * 0.5) * devicePixelRatio) /
            zoom;
          const distanceFromCenter = Math.sqrt(
            Math.pow(mouseXOnCanvas - (element.x1 + element.width / 2), 2) +
              Math.pow(mouseYOnCanvas - (element.y1 + element.height / 2), 2)
          );
          const originalDistanceFromCenter =
            Math.sqrt(
              Math.pow(element.width, 2) + Math.pow(element.height, 2)
            ) / 2;

          const scaleFactor = Math.max(
            0.04,
            distanceFromCenter / originalDistanceFromCenter
          );

          const newWidth = element.width * scaleFactor;
          const newHeight = element.height * scaleFactor;
          const newX1 = element.x1 + element.width / 2 - newWidth / 2;
          const newY1 = element.y1 + element.height / 2 - newHeight / 2;

          newElements.push({
            ...element,
            x1: newX1,
            y1: newY1,
            width: newWidth,
            height: newHeight,
          });
        } else {
          newElements.push(element);
        }
      });
      setElements(
        String(Number(synthContext?.current?.layer?.id)),
        newElements,
        true,
        false
      );
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (action === "writing") return;
    setAction("none");
    setSelectedElement(null);
  };

  const addImageToCanvas = async (): Promise<void> => {
    if (
      !synthContext?.current?.completedSynths?.get(
        String(Number(synthContext?.current?.layer?.id))
      )
    )
      return;
    let imgURL: string;

    if (
      synthContext?.current?.completedSynths?.get(
        String(Number(synthContext?.current?.layer?.id))
      )?.chosen
    ) {
      imgURL = synthContext?.current?.completedSynths?.get(
        String(Number(synthContext?.current?.layer?.id))
      )?.chosen!;
    } else {
      imgURL = synthContext?.current?.completedSynths?.get(
        String(Number(synthContext?.current?.layer?.id))
      )?.synths![
        synthContext?.current?.completedSynths?.get(
          String(Number(synthContext?.current?.layer?.id))
        )?.synths!?.length - 1
      ]!;
    }

    let postImage = "data:image/png;base64," + imgURL;

    try {
      const imageObject = new Image();
      imageObject.src = postImage;
      imageObject.width = imageObject.width * devicePixelRatio;
      imageObject.height = imageObject.height * devicePixelRatio;
      imageObject.onload = () => {
        handleImageAdd(imageObject);
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleImageAdd = (imageObject: HTMLImageElement): void => {
    try {
      const oldElements =
        history.get(String(Number(synthContext?.current?.layer?.id))) || [];

      let newElements = oldElements.filter(
        (element) => element.type !== "image"
      );

      const region = getRegionOfInterest(newElements[0]);

      const aspectRatio = imageObject.width / imageObject.height;
      const regionMax = Math.max(region?.width!, region?.height!);

      let newWidth: number, newHeight: number;

      if (imageObject.width < imageObject.height) {
        newHeight = regionMax;
        newWidth = newHeight * aspectRatio;
      } else {
        newWidth = regionMax;
        newHeight = newWidth / aspectRatio;
      }

      const newElement = {
        clipElement:
          history.get(String(Number(synthContext?.current?.layer?.id)))?.[0] ||
          [],
        image: imageObject,
        type: "image",
        width: newWidth,
        height: newHeight,
        x1: region?.x! - newWidth / 2,
        y1: region?.y! - newHeight / 2,
      };

      newElements = [newElements[0], newElement];
      setElements(
        String(Number(synthContext?.current?.layer?.id)),
        newElements?.map((element, index) => ({ ...element, id: index })),
        true,
        false
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const generateLoadNoise = () => {
    let offset = 0;
    const blockSize = 8 + synthProgress * 24;

    for (
      let y = 0;
      y < Number(synthContext?.canvasSize.height);
      y += blockSize
    ) {
      for (
        let x = 0;
        x < Number(synthContext?.canvasSize.width);
        x += blockSize
      ) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const alpha = Math.max(0.4, 1 - synthProgress);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillRect(x + offset, y + offset, blockSize, blockSize);
      }
    }

    offset += 0.5;
    if (offset > blockSize) offset = 0;
  };

  useEffect(() => {
    const textAreaElement = writingRef.current;
    if (action === "writing" && textAreaElement) {
      textAreaElement.focus();
      textAreaElement.value = selectedElement?.text || "";
    }
  }, [tool, action, selectedElement]);

  useEffect(() => {
    if (clear) {
      const newElements = lodash.filter(
        history.get(String(Number(synthContext?.current?.layer?.id))) || [],
        (element: SvgPatternType) => {
          if (element.type === "pattern" || element.type === "circle") {
            return true;
          }
        }
      );
      setElements(
        String(Number(synthContext?.current?.layer?.id)),
        newElements,
        false,
        false
      );
      setClear(false);
    }
  }, [clear]);

  const handleBlur = (e: FormEvent) => {
    if (synthLoading) return;
    if ((e as any).key === "Enter") {
      const bounds = canvas?.getBoundingClientRect();
      setAction("none");
      setSelectedElement(null);
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvas,
        zoom,
        history.get(String(Number(synthContext?.current?.layer?.id))) || [],
        setElements,
        String(Number(synthContext?.current?.layer?.id)),
        ctx!,
        (selectedElement?.x1! * devicePixelRatio +
          bounds.left * zoom -
          pan.xOffset) /
          zoom,
        (selectedElement?.y1! * devicePixelRatio +
          bounds.top * zoom -
          pan.yOffset) /
          zoom,
        selectedElement?.x2!,
        selectedElement?.y2!,
        tool,
        selectedElement?.id!,
        brushWidth,
        hex,
        (e.target as HTMLFormElement)?.value,
        font
      );
    }
  };

  const handleReset = () => {
    setClear(true);
    setZoom(1);
    setPan({
      xInitial: 0,
      yInitial: 0,
      xOffset: 0,
      yOffset: 0,
    });
  };

  useEffect(() => {
    if (
      synthContext?.current?.layer &&
      canvas &&
      ctx &&
      synthContext?.canvasSize.width === canvas?.width &&
      synthContext?.canvasSize.height === canvas?.height &&
      !newLayersLoading
    ) {
      synthLayerSwitch();
    }
  }, [
    synthContext?.current?.layer,
    synthContext?.current?.synth,
    synthContext?.current?.template,
    synthContext?.canvasSize,
    ctx,
  ]);

  useEffect(() => {
    if (ctx) {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      if (
        synthContext?.canvasSize.width !== canvas.width ||
        synthContext?.canvasSize.height !== canvas.height
      ) {
        if (newLayersLoading) return;
        synthContext?.setCanvasSize((prev) => ({
          ...prev,
          width: canvas.width,
          height: canvas.height,
        }));
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(pan.xOffset, pan.yOffset);
      ctx.scale(zoom, zoom);

      ctx.clearRect(0, 0, canvas?.width!, canvas?.height!);
      ctx.beginPath();

      ctx.imageSmoothingEnabled = false;
      ctx.imageSmoothingQuality = "high";

      const currentIndex =
        index.get(String(Number(synthContext?.current?.layer?.id))) !==
        undefined
          ? index.get(String(Number(synthContext?.current?.layer?.id)))
          : -1;
      const allElements =
        history.get(String(Number(synthContext?.current?.layer?.id))) !==
        undefined
          ? history.get(String(Number(synthContext?.current?.layer?.id)))
          : [];

      const elements = allElements?.slice(0, currentIndex! + 1);

      (ctx as CanvasRenderingContext2D).globalCompositeOperation =
        "source-over";

      elements?.forEach(
        (element: SvgPatternType | ElementInterface, index: number) => {
          if (synthLoading && synthProgress < 0.97) {
            if (index === 0) {
              const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawPatternElement(
                  element as SvgPatternType,
                  ctx,
                  materialBackground
                );
                ctx.save();
                ctx.clip();
                generateLoadNoise();
                ctx.restore();

                frameId.current = window.requestAnimationFrame(animate);
              };
              animate();
            }
          } else {
            if (
              action === "writing" &&
              selectedElement?.id === element.id &&
              element.type === "text"
            ) {
              return;
            }
            if (
              element.type === "image" ||
              element.type === "pattern" ||
              element.type === "circle"
            ) {
              drawPatternElement(
                element as SvgPatternType,
                ctx,
                materialBackground
              );
            } else {
              drawElement(element as ElementInterface, ctx, materialBackground);
            }
          }
        }
      );
      ctx.restore();
    }

    return () => {
      if (frameId.current) {
        window.cancelAnimationFrame(frameId.current);
      }
    };
  }, [
    history,
    index,
    zoom,
    pan,
    tool,
    action,
    synthContext?.current?.layer?.id,
    canvas,
    ctx,
    isDragging,
    materialBackground,
    synthContext?.canvasExpand,
    synthProgress,
    synthLoading,
  ]);

  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      canvas.addEventListener("touchmove", preventZoom, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
        canvas.removeEventListener("touchmove", preventZoom);
      }
    };
  }, [canvas, handleWheel, synthContext?.canvasExpand]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo(String(Number(synthContext?.current?.layer?.id)));
        } else {
          undo(String(Number(synthContext?.current?.layer?.id)));
        }
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  useEffect(() => {
    if (
      synthContext?.current?.completedSynths?.get(
        String(Number(synthContext?.current?.layer?.id))
      )?.synths &&
      canvas
    ) {
      synthContext?.current?.completedSynths?.get(
        String(Number(synthContext?.current?.layer?.id))
      )!.synths.length > 0 && addImageToCanvas();
    }
  }, [
    synthContext?.current?.completedSynths?.get(
      String(Number(synthContext?.current?.layer?.id))
    )?.chosen,
    itemClicked,
  ]);

  return {
    canvasRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    newLayersLoading,
    isDragging,
    hex,
    setHex,
    setColorPicker,
    showBottomOptions,
    setShowBottomOptions,
    thickness,
    setThickness,
    brushWidth,
    setBrushWidth,
    setTool,
    colorPicker,
    tool,
    undo,
    redo,
    handleImageAdd,
    handleReset,
    writingRef,
    handleBlur,
    action,
    selectedElement,
    font,
    fontOpen,
    setFont,
    setFontOpen,
    materialBackground,
    materialOpen,
    setMaterialBackground,
    setMaterialOpen,
    history,
    itemClicked,
    setItemClicked,
  };
};

export default useCanvas;
