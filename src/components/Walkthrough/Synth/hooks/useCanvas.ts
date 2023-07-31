import {
  FormEvent,
  MouseEvent,
  MutableRefObject,
  WheelEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
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
import { setInitImagePrompt } from "../../../../../redux/reducers/initImagePromptSlice";
import updateElement from "../../../../../lib/canvas/helpers/updateElement";
import { isPointInPattern } from "../../../../../lib/canvas/helpers/isPointInPattern";

const useCanvas = () => {
  const dispatch = useDispatch();
  const layerToSynth = useSelector(
    (state: RootState) => state.app.layerToSynthReducer.value
  );
  let animationFrameId: number | null = null;

  const synthLayerSelected = useSelector(
    (state: RootState) => state.app.synthLayerReducer.value
  );
  const synthLoading = useSelector(
    (state: RootState) => state.app.synthLoadingReducer.value
  );
  const canvasOpen = useSelector(
    (state: RootState) => state.app.expandCanvasReducer.value
  );
  const [canvas, setCanvas] = useState<any>(null);
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  }, []);
  const writingRef = useRef<HTMLTextAreaElement>(null);
  const ctx = canvas?.getContext("2d") as any;
  const [elements, setElements, undo, redo] = useElements([]);
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
  const [synthElementMove, setSynthElementMove] =
    useState<ElementInterface | null>();
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(3);
  const [thickness, setThickness] = useState<boolean>(false);
  const [newLayersLoading, setNewLayersLoading] = useState<boolean>(false);
  const [saveImagesLocal, setSaveImagesLocal] = useState<boolean>(false);
  const [clear, setClear] = useState<boolean>(false);
  const [action, setAction] = useState<string>("none");

  const synthLayerSwitch = async () => {
    setNewLayersLoading(true);
    await addRashToCanvas(setElements, layerToSynth!, canvas!);
    setZoom(1);
    setPan({
      xInitial: 0,
      yInitial: 0,
      xOffset: 0,
      yOffset: 0,
    });
    setTimeout(() => {
      setNewLayersLoading(false);
    }, 1000);
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      wheelLogic(e, zoom, setZoom, canvas!, pan, setPan, 14);
    },
    [zoom, setZoom, canvas, pan, setPan]
  );

  const handleMouseDown = (e: MouseEvent): void => {
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
        elements[0],
        ctx,
        elements[0].type === "circle" ? true : false
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
        elements.length,
        brushWidth,
        tool !== "erase" ? hex : materialBackground,
        tool !== "text" ? undefined : font
      );
      setAction(
        tool === "pencil" ? "drawing" : tool === "erase" ? "erasing" : "writing"
      );
      setSelectedElement(newElement!);
      setElements([...elements, newElement]);
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
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
        elements[0],
        ctx,
        elements[0].type === "circle" ? true : false
      )
    ) {
      setColorPicker(false);
      setFontOpen(false);
      setThickness(false);
      const index = elements?.length - 1;
      const values = elements?.[index];
      updateElement(
        {
          xOffset: pan.xOffset * 0.5,
          yOffset: pan.yOffset * 0.5,
        },
        canvas,
        zoom,
        elements,
        setElements,
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

  const addImageToCanvas = async (imgURL: any): Promise<void> => {
    try {
      let postImage;
      let blob: Blob;
      postImage = "data:image/png;base64," + imgURL;
      const res: Response = await fetch(imgURL);
      blob = await res.blob();
      postImage = new File([blob], "thedial_drafts", {
        type: "image/png",
      });
      if (saveImagesLocal) {
        const binary = window.atob(imgURL);
        const buffer = new ArrayBuffer(binary.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < binary.length; i++) {
          view[i] = binary.charCodeAt(i);
        }
        blob = new Blob([buffer], { type: "image/png" });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob!);
        link.download = "the_dial_synth";
        link.click();
        URL.revokeObjectURL(link.href);
      }
      await handleImageAdd(postImage);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleImageAdd = async (e: any): Promise<void> => {
    if ((e as any).target.files.length < 1) {
      return;
    }
    try {
      let image: File;
      image = (e.target as HTMLFormElement).files[0];
      const reader = new FileReader();
      reader?.readAsDataURL(image);
      reader.onloadend = async (e) => {
        return new Promise((resolve, reject) => {
          const imageObject = new Image();
          imageObject.src = e.target?.result as string;
          imageObject.onload = () => {
            let newElements = [...elements];

            newElements = newElements.filter(
              (element) => element.type !== "image"
            );

            const patternWidth = canvas?.width;
            const scaleFactor = patternWidth / imageObject.width;
            const newElement = {
              clipElement: elements[0],
              image: imageObject,
              type: "image",
              width: patternWidth,
              height: imageObject.height * scaleFactor,
            };

            const insertIndex = newElements[1]?.type === "image" ? 2 : 1;

            newElements.splice(insertIndex, 0, newElement);

            setElements(
              newElements?.map((element, index) => ({ ...element, id: index }))
            );
            resolve(undefined);
          };
          imageObject.onerror = reject;
          setSynthElementMove(undefined);
        }).catch((err) => {
          console.error(err.message);
        });
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handlePatternSave = () => {
    const img = canvas.toDataURL("image/png");
    let xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      let a = document.createElement("a");
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = "pattern_aop_template.png";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    xhr.open("GET", img);
    xhr.send();
  };

  useEffect(() => {
    const textAreaElement = writingRef.current;
    if (action === "writing" && textAreaElement) {
      textAreaElement.focus();
      textAreaElement.value = selectedElement?.text || "";
    }
  }, [tool, action, selectedElement]);

  useLayoutEffect(() => {
    if (clear) {
      const newElements = lodash.filter(elements, (element: SvgPatternType) => {
        if (element.type === "pattern" || element.type === "circle") {
          return true;
        }
      });
      setElements(newElements);
      setClear(false);
    }
  }, [clear]);

  const handleBlur = (e: FormEvent) => {
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
        elements,
        setElements,
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
    if (layerToSynth && canvas && ctx) {
      synthLayerSwitch();
    }
  }, [layerToSynth, synthLayerSelected]);

  useLayoutEffect(() => {
    if (ctx) {
      canvas.width = canvas?.offsetWidth * devicePixelRatio;
      canvas.height = canvas?.offsetHeight * devicePixelRatio;
      ctx.clearRect(0, 0, canvas?.width!, canvas?.height!);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(pan.xOffset, pan.yOffset);
      ctx.scale(zoom, zoom);
      ctx.beginPath();

      (ctx as CanvasRenderingContext2D).globalCompositeOperation =
        "source-over";
      elements?.forEach((element: SvgPatternType | ElementInterface) => {
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
      });
      ctx.restore();
    }
  }, [
    elements,
    synthElementMove,
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
  }, [canvas, handleWheel]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

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
