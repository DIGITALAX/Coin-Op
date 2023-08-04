import {
  FormEvent,
  MouseEvent,
  WheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ElementInterface, SvgPatternType } from "../types/synth.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import addRashToCanvas from "../../../../../lib/canvas/helpers/addRashToCanvas";
import useElements from "./useElements";
import lodash from "lodash";
import wheelLogic from "../../../../../lib/canvas/helpers/wheelLogic";
import drawElement from "../../../../../lib/canvas/helpers/drawElement";
import drawPatternElement from "../../../../../lib/canvas/helpers/drawPatternElement";
import createElement from "../../../../../lib/canvas/helpers/createElement";
import updateElement from "../../../../../lib/canvas/helpers/updateElement";
import { isPointInPattern } from "../../../../../lib/canvas/helpers/isPointInPattern";
import { setCanvasSize } from "../../../../../redux/reducers/canvasSizeSlice";

const useCanvas = () => {
  const dispatch = useDispatch();
  let animationFrameId: number | null = null;
  const layerToSynth = useSelector(
    (state: RootState) => state.app.layerToSynthReducer.value
  );
  const synthLayerSelected = useSelector(
    (state: RootState) => state.app.synthLayerReducer.value
  );
  const synthLoading = useSelector(
    (state: RootState) => state.app.synthLoadingReducer.value
  );
  const completedSynths = useSelector(
    (state: RootState) => state.app.completedSynthsReducer.value
  );
  const synthProgress = useSelector(
    (state: RootState) => state.app.synthProgressReducer.value
  );
  const patternSize = useSelector(
    (state: RootState) => state.app.synthAreaReducer.value
  );
  const canvasSize = useSelector(
    (state: RootState) => state.app.canvasSizeReducer.value
  );
  const canvasOpen = useSelector(
    (state: RootState) => state.app.expandCanvasReducer.value
  );
  const frameId = useRef<number | null>();
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
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(3);
  const [thickness, setThickness] = useState<boolean>(false);
  const [newLayersLoading, setNewLayersLoading] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [action, setAction] = useState<string>("none");

  const synthLayerSwitch = async () => {
    if (!layerToSynth.layer || newLayersLoading) return;
    setNewLayersLoading(true);
    let addRashToCanvasPromise;
    if (!history.get(String(layerToSynth.id))) {
      addRashToCanvasPromise = addRashToCanvas(
        setElements,
        layerToSynth.layer!,
        layerToSynth.id!,
        canvas!,
        dispatch
      );
    } else {
      addRashToCanvasPromise = addRashToCanvas(
        setElements,
        layerToSynth.layer!,
        layerToSynth.id!,
        canvas!,
        dispatch,
        history.get(String(layerToSynth.id)),
        canvasSize
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
    (e: WheelEvent) => {
      e.preventDefault();
      wheelLogic(e, zoom, setZoom, canvas!, pan, setPan, canvasOpen ? 30 : 14);
    },
    [zoom, setZoom, canvas, pan, setPan, canvasOpen]
  );

  const handleMouseDown = (e: MouseEvent): void => {
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
      (tool === "pencil" || tool === "text" || tool === "erase") &&
      isPointInPattern(
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        history.get(String(layerToSynth.id))?.[0] || [],
        ctx,
        (history.get(String(layerToSynth.id))?.[0] || []).type === "circle"
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
        (history.get(String(layerToSynth.id)) || []).length,
        brushWidth,
        tool !== "erase" ? hex : materialBackground,
        tool !== "text" ? undefined : font
      );
      setAction(
        tool === "pencil" ? "drawing" : tool === "erase" ? "erasing" : "writing"
      );
      setSelectedElement(newElement!);
      setElements(String(layerToSynth.id), [
        ...(history.get(String(layerToSynth.id)) || []),
        newElement,
      ]);
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
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
        history.get(String(layerToSynth.id))?.[0] || [],
        ctx,
        (history.get(String(layerToSynth.id))?.[0] || []).type === "circle"
          ? true
          : false
      )
    ) {
      setColorPicker(false);
      setFontOpen(false);
      setThickness(false);
      const index = (history.get(String(layerToSynth.id)) || [])?.length - 1;
      const values = (history.get(String(layerToSynth.id)) || [])?.[index];
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvas,
        zoom,
        history.get(String(layerToSynth.id)) || [],
        setElements,
        String(layerToSynth.id),
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
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
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
    if (!completedSynths.get(String(layerToSynth.id))) return;
    let imgURL: string;

    if (completedSynths.get(String(layerToSynth.id))?.chosen) {
      imgURL = completedSynths.get(String(layerToSynth.id))?.chosen!;
    } else {
      imgURL = completedSynths.get(String(layerToSynth.id))?.synths![
        completedSynths.get(String(layerToSynth.id))?.synths!?.length - 1
      ]!;
    }

    let postImage = "data:image/png;base64," + imgURL;

    try {
      const imageObject = new Image();
      imageObject.src = postImage;
      imageObject.onload = () => {
        handleImageAdd(imageObject);
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleImageAdd = (imageObject: HTMLImageElement): void => {
    try {
      let newElements = [...(history.get(String(layerToSynth.id)) || [])];

      newElements = newElements.filter((element) => element.type !== "image");

      const widthScaleFactor = patternSize.originalWidth / imageObject.width;
      const heightScaleFactor = patternSize.originalHeight / imageObject.height;
      const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);
      const newElement = {
        clipElement: history.get(String(layerToSynth.id))?.[0] || [],
        image: imageObject,
        type: "image",
        width: imageObject.width * scaleFactor,
        height: imageObject.height * scaleFactor,
      };

      const insertIndex = newElements[1]?.type === "image" ? 2 : 1;

      newElements.splice(insertIndex, 0, newElement);

      setElements(
        String(layerToSynth.id),
        newElements?.map((element, index) => ({ ...element, id: index }))
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const generateLoadNoise = () => {
    let offset = 0;
    const blockSize = 8 + synthProgress * 24;

    for (let y = 0; y < canvasSize.height; y += blockSize) {
      for (let x = 0; x < canvasSize.width; x += blockSize) {
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
        history.get(String(layerToSynth.id)) || [],
        (element: SvgPatternType) => {
          if (element.type === "pattern" || element.type === "circle") {
            return true;
          }
        }
      );
      setElements(String(layerToSynth.id), newElements);
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
        history.get(String(layerToSynth.id)) || [],
        setElements,
        String(layerToSynth.id),
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
      layerToSynth &&
      canvas &&
      ctx &&
      canvasSize.width === canvas.width &&
      canvasSize.height === canvas.height &&
      !newLayersLoading
    ) {
      synthLayerSwitch();
    }
  }, [layerToSynth, synthLayerSelected, canvasSize]);

  useEffect(() => {
    if (ctx) {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      if (
        canvasSize.width !== canvas.width ||
        canvasSize.height !== canvas.height
      ) {
        if (newLayersLoading) return;
        dispatch(
          setCanvasSize({
            width: canvas.width,
            height: canvas.height,
            oldWidth: canvasSize.width,
            oldHeight: canvasSize.height,
          })
        );
      }

      ctx.clearRect(0, 0, canvas?.width!, canvas?.height!);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(pan.xOffset, pan.yOffset);
      ctx.scale(zoom, zoom);
      ctx.beginPath();

      const currentIndex = index.get(String(layerToSynth.id)) || 0;
      const allElements = history.get(String(layerToSynth.id)) || [];
      const elements = allElements.slice(0, currentIndex + 1);

      (ctx as CanvasRenderingContext2D).globalCompositeOperation =
        "source-over";
      elements?.forEach(
        (element: SvgPatternType | ElementInterface, index: number) => {
          if (synthLoading && synthProgress < 0.99) {
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
    layerToSynth,
    canvas,
    ctx,
    isDragging,
    materialBackground,
    canvasOpen,
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
  }, [canvas, handleWheel, canvasOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo(String(layerToSynth.id));
        } else {
          undo(String(layerToSynth.id));
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
    if (completedSynths.get(String(layerToSynth.id))?.synths && canvas) {
      completedSynths.get(String(layerToSynth.id))!.synths.length > 0 &&
        addImageToCanvas();
    }
  }, [
    completedSynths.get(String(layerToSynth.id))?.chosen,
    completedSynths.get(String(layerToSynth.id))?.synths,
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
  };
};

export default useCanvas;
