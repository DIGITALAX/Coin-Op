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
import { SvgPatternType } from "../types/synth.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import addRashToCanvas from "../../../../../lib/canvas/helpers/addRashToCanvas";
import useElements from "./useElements";
import lodash from "lodash";
import wheelLogic from "../../../../../lib/canvas/helpers/wheelLogic";
import drawElement from "../../../../../lib/canvas/helpers/drawElement";
import drawPatternElement from "../../../../../lib/canvas/helpers/drawPatternElement";
import onPatternElement from "../../../../../lib/canvas/helpers/onPatternElement";
import createElement from "../../../../../lib/canvas/helpers/createElement";
import createCanvasInit from "../../../../../lib/canvas/helpers/createCanvasInit";
import { setInitImagePrompt } from "../../../../../redux/reducers/initImagePromptSlice";
import updateElement from "../../../../../lib/canvas/helpers/updateElement";

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
  const [canvas, setCanvas] = useState<any>(null);
  const canvasRef = useCallback((canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  }, []);
  const writingRef = useRef<HTMLTextAreaElement>(null);
  const ctx = canvas?.getContext("2d") as any;
  const [elements, setElements, undo, redo] = useElements([], true);
  const [zoom, setZoom] = useState<number>(1);
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
  const [selectedElement, setSelectedElement] = useState<SvgPatternType | null>(
    null
  );
  const [synthElementMove, setSynthElementMove] =
    useState<SvgPatternType | null>();
  const [hex, setHex] = useState<string>("#000000");
  const [colorPicker, setColorPicker] = useState<boolean>(false);
  const [brushWidth, setBrushWidth] = useState<number>(12);
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
      wheelLogic(e, zoom, setZoom, canvas!, pan, setPan, 8);
    },
    [zoom, setZoom, canvas, pan, setPan]
  );

  const handleMouseDown = (e: MouseEvent): void => {
    setIsDragging(true);
    setPan({
      ...pan,
      xInitial: e.clientX - pan.xOffset,
      yInitial: e.clientY - pan.yOffset,
    });
    // const bounds = canvas?.getBoundingClientRect();
    // if (tool === "pan") {
    //   setPan({
    //     xInitial: e.clientX - bounds?.left!,
    //     yInitial: e.clientY - bounds?.top!,
    //     xOffset: pan.xOffset,
    //     yOffset: pan.yOffset,
    //   });
    //   setAction("panning");
    // } else if (tool === "synth" && !synthLoading) {
    //   setAction("synth");
    //   if (synthElementMove) {
    //     const elementsArray =
    //       synthElementSelect.findIndex(
    //         (elem) => elem.id === synthElementMove.id
    //       ) !== -1
    //         ? synthElementSelect.filter((elem) => {
    //             return elem.id !== synthElementMove.id;
    //           })
    //         : [...synthElementSelect, synthElementMove];
    //     dispatch(setSelectSynthElement(elementsArray));
    //     const canvasInit: string[] = [];
    //     elementsArray.forEach((element) => {
    //       canvasInit.push(createCanvasInit(element, canvasRef as any, canvas!));
    //     });
    //     dispatch(setInitImagePrompt(canvasInit[0]));
    //   }
    // } else if (tool === "default") {
    //   setAction("none");
    // } else if (tool === "erase" || tool === "selection" || tool == "resize") {
    //   const positionArray = onPatternElement(
    //     elements,
    //     zoom,
    //     pan,
    //     e,
    //     canvas!,
    //     false
    //   );

    //   if (positionArray?.[0]) {
    //     const elementsCopy = [...(elements || [])];

    //     if (tool === "erase") {
    //       if (
    //         positionArray[0]?.type === "pencil" ||
    //         positionArray[0]?.type === "text"
    //       ) {
    //         elementsCopy[positionArray[0].id] = {
    //           ...elementsCopy[positionArray[0].id],
    //           fill: "#078FD6",
    //           stroke: "#078FD6",
    //         };
    //         setElements(elementsCopy);
    //       }
    //       setSelectedElement(positionArray[0]);
    //     } else {
    //       if (positionArray[0]?.type === "pencil") {
    //         const offsetXs = positionArray[0]?.points?.map(
    //           (point) =>
    //             ((e.clientX - pan.xOffset * zoom * zoom * 0.5) *
    //               devicePixelRatio) /
    //               zoom -
    //             point.x
    //         );
    //         const offsetYs = positionArray[0]?.points?.map(
    //           (point) =>
    //             ((e.clientY - pan.yOffset * zoom * zoom * 0.5) *
    //               devicePixelRatio) /
    //               zoom -
    //             point.y
    //         );
    //         setSelectedElement({
    //           ...positionArray[0],
    //           offsetXs: offsetXs!,
    //           offsetYs: offsetYs!,
    //         });
    //       } else {
    //         setSelectedElement({
    //           ...positionArray[0],
    //           offsetX: (e.clientX - bounds?.left!) * devicePixelRatio,
    //           offsetY: (e.clientY - bounds?.top!) * devicePixelRatio,
    //         });
    //       }

    //       if (tool === "selection") {
    //         setAction("moving");
    //       } else if (tool === "resize") {
    //         setAction("resizing");
    //       }
    //     }
    //   }
    // } else if (tool === "pencil" || tool === "text") {
    //   const newElement = createElement(
    //     {
    //       xOffset: pan.xOffset * 0.5,
    //       yOffset: pan.yOffset * 0.5,
    //     },
    //     canvas!,
    //     zoom,
    //     e.clientX,
    //     e.clientY,
    //     e.clientX,
    //     e.clientY,
    //     tool,
    //     elements.length,
    //     brushWidth,
    //     hex,
    //     hex
    //   );
    //   setAction(tool === "pencil" ? "drawing" : "writing");
    //   setSelectedElement(newElement!);
    //   setElements([...(elements || []), newElement]);
    // }
  };

  const handleMouseMove = (e: MouseEvent): void => {
    const { clientX, clientY } = e;
    if (zoom > 1 && isDragging) {
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
    }

    // const ctx = canvas?.getContext("2d");
    // if (!action || action === "writing") return;
    // const bounds = canvas?.getBoundingClientRect();
    // if (action === "panning") {
    //   setPan({
    //     xInitial: pan.xInitial,
    //     yInitial: pan.yInitial,
    //     xOffset:
    //       pan.xOffset +
    //       0.5 * ((e.clientX - bounds?.left! - pan.xInitial) / zoom),
    //     yOffset:
    //       pan.yOffset +
    //       0.5 * ((e.clientY - bounds?.top! - pan.yInitial) / zoom),
    //   });
    // } else if ((action === "synth" || action === "none") && !synthLoading) {
    //   const positionArray = onPatternElement(
    //     elements,
    //     zoom,
    //     pan,
    //     e,
    //     canvas!,
    //     true
    //   );
    //   if (positionArray?.[0]) {
    //     setSynthElementMove(positionArray[0]);
    //   } else {
    //     setSynthElementMove(null);
    //   }
    // } else if (action === "moving") {
    //   if (selectedElement?.type === "image") {
    //     const newElement = {
    //       clipElement: {
    //         ...selectedElement.clipElement,
    //         posX:
    //           selectedElement.clipElement?.posX! -
    //           (selectedElement.offsetX! -
    //             (e.clientX - bounds?.left!) * devicePixelRatio),
    //         posY:
    //           selectedElement.clipElement?.posY! -
    //           (selectedElement.offsetY! -
    //             (e.clientY - bounds?.top!) * devicePixelRatio),
    //       },
    //       width: selectedElement.width,
    //       height: selectedElement.height,
    //       image: selectedElement.image,
    //       id: selectedElement.id,
    //       type: selectedElement.type,
    //     };
    //     const updatedElements = elements?.map((element: SvgPatternType) =>
    //       element.id === selectedElement.id ? newElement : element
    //     );
    //     setElements(updatedElements, true);
    //   } else if (selectedElement?.type === "pencil") {
    //     const newPoints = selectedElement.points?.map(
    //       (_: any, index: number) => ({
    //         x:
    //           ((e.clientX - pan.xOffset * zoom * zoom * 0.5) / zoom) *
    //             devicePixelRatio -
    //           selectedElement?.offsetXs!?.[index],
    //         y:
    //           ((e.clientY - pan.yOffset * zoom * zoom * 0.5) / zoom) *
    //             devicePixelRatio -
    //           selectedElement?.offsetYs!?.[index],
    //       })
    //     );
    //     const elementsCopy = [...(elements || [])];
    //     elementsCopy[selectedElement.id] = {
    //       ...elementsCopy[selectedElement.id],
    //       points: newPoints,
    //     };
    //     setElements(elementsCopy, true);
    //   } else {
    //     const textWidth = ctx?.measureText(selectedElement?.text!).width!;
    //     const textHeight = ctx?.measureText("M").width! / 2;
    //     const newElement = {
    //       ...selectedElement,
    //       x1:
    //         ((e.clientX - bounds?.left! - pan.xOffset * 0.5) *
    //           devicePixelRatio) /
    //         zoom,
    //       y1:
    //         ((e.clientY - bounds?.top! - pan.yOffset * 0.5) *
    //           devicePixelRatio) /
    //         zoom,
    //       x2:
    //         ((e.clientX - bounds?.left! - pan.xOffset * 0.5) *
    //           devicePixelRatio) /
    //           zoom +
    //         textWidth * zoom,
    //       y2:
    //         ((e.clientY - bounds?.top! - pan.yOffset * 0.5) *
    //           devicePixelRatio) /
    //           zoom +
    //         textHeight * zoom,
    //     };
    //     const updatedElements = elements?.map((element: SvgPatternType) =>
    //       element.id === selectedElement?.id ? newElement : element
    //     );
    //     setElements(updatedElements, true);
    //   }
    // } else if (action === "resizing" && selectedElement) {
    //   if (selectedElement.type === "image") {
    //     const newElement = {
    //       clipElement: selectedElement.clipElement,
    //       image: selectedElement.image,
    //       width:
    //         selectedElement.width! +
    //         (selectedElement.offsetX! -
    //           (e.clientX - bounds?.left!) * devicePixelRatio),
    //       height:
    //         selectedElement.height! +
    //         (selectedElement.width! / selectedElement.height!) *
    //           (selectedElement.offsetX! -
    //             (e.clientX - bounds?.left!) * devicePixelRatio),
    //       id: selectedElement.id,
    //       type: selectedElement.type,
    //     };
    //     const updatedElements = elements?.map((element: SvgPatternType) =>
    //       element.id === selectedElement.id ? newElement : element
    //     );
    //     setElements(updatedElements, true);
    //   }
    // } else if (action === "drawing") {
    //   const index = elements?.length - 1;
    //   const values = elements?.[index];
    //   updateElement(
    //     {
    //       xOffset: pan.xOffset * 0.5,
    //       yOffset: pan.yOffset * 0.5,
    //     },
    //     canvas!,
    //     zoom,
    //     elements,
    //     setElements,
    //     ctx!,
    //     values?.x1!,
    //     values?.y1!,
    //     e.clientX,
    //     e.clientY,
    //     tool,
    //     index,
    //     brushWidth,
    //     hex,
    //     null,
    //     hex
    //   );
    // }
  };

  const handleMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    // if (selectedElement) {
    //   if (
    //     selectedElement.type === "text" &&
    //     e.clientX - selectedElement?.offsetX! === selectedElement.x1 &&
    //     e.clientY - selectedElement?.offsetY! === selectedElement.y1
    //   ) {
    //     setAction("writing");
    //     return;
    //   }
    //   if (tool === "erase") {
    //     const filteredElements = lodash.filter(
    //       elements,
    //       (element) => element.id !== selectedElement.id
    //     );
    //     const updatedElements = filteredElements?.map((element, index) => ({
    //       ...element,
    //       id: index,
    //     }));
    //     setElements(updatedElements);
    //   }
    // }
    // if (action === "writing") return;
    // setAction("none");
    // setSelectedElement(null);
  };

  const addImageToCanvas = async (
    imgURL: any,
    local?: boolean
  ): Promise<void> => {
    try {
      let postImage;
      let blob: Blob;
      if (local) {
        postImage = "data:image/png;base64," + imgURL;
      } else {
        const res: Response = await fetch(imgURL);
        blob = await res.blob();
        postImage = new File([blob], "thedial_drafts", {
          type: "image/png",
        });
      }
      if (saveImagesLocal) {
        if (local) {
          const binary = window.atob(imgURL);
          const buffer = new ArrayBuffer(binary.length);
          const view = new Uint8Array(buffer);
          for (let i = 0; i < binary.length; i++) {
            view[i] = binary.charCodeAt(i);
          }
          blob = new Blob([buffer], { type: "image/png" });
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob!);
        link.download = "the_dial_synth";
        link.click();
        URL.revokeObjectURL(link.href);
      }
      await handleImageAdd(postImage, true, local);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleImageAdd = async (
    e: any,
    url?: boolean,
    local?: boolean
  ): Promise<void> => {
    if (!url) {
      if ((e as any).target.files.length < 1) {
        return;
      }
    }
    try {
      if (!local) {
        let image: File;
        if (url) {
          image = e;
        } else {
          image = (e.target as HTMLFormElement).files[0];
        }
        const reader = new FileReader();
        reader?.readAsDataURL(image);
        reader.onloadend = async (e) => {
          const imagePromises = elements[0]?.map(
            (selectedTemplate: SvgPatternType) => {
              return new Promise((resolve, reject) => {
                const imageObject = new Image();
                imageObject.src = e.target?.result as string;
                imageObject.onload = () => {
                  const matchedIndex = elements.findIndex(
                    (element: SvgPatternType) =>
                      selectedTemplate?.points === element.points
                  );
                  resolve({ selectedTemplate, imageObject, matchedIndex });
                };
                imageObject.onerror = reject;
              });
            }
          );
          await Promise.all(imagePromises).then((loadedImages: any) => {
            loadedImages.sort(
              (a: any, b: any) => a.matchedIndex - b.matchedIndex
            );
            let newElements = [...elements];
            let numImagesAdded = 0;
            loadedImages.forEach(
              ({ selectedTemplate, imageObject, matchedIndex }: any) => {
                const newElement = {
                  clipElement: selectedTemplate,
                  image: imageObject,
                  type: "image",
                  width: imageObject.width,
                  height: imageObject.height,
                };
                newElements = [
                  ...newElements.slice(0, matchedIndex + numImagesAdded + 1),
                  newElement,
                  ...newElements.slice(
                    newElements[matchedIndex + numImagesAdded + 1]?.type ===
                      "image"
                      ? matchedIndex + numImagesAdded + 2
                      : matchedIndex + numImagesAdded + 1
                  ),
                ];
                numImagesAdded++;
              }
            );
            setElements(
              newElements?.map((element, index) => ({ ...element, id: index }))
            );
          });
          setSynthElementMove(undefined);
        };
      } else {
        const imagePromises = elements[0]?.map(
          (selectedTemplate: SvgPatternType) => {
            return new Promise((resolve, reject) => {
              const imageObject = new Image();
              imageObject.src = e;
              imageObject.onload = () => {
                const matchedIndex = elements.findIndex(
                  (element: SvgPatternType) =>
                    selectedTemplate?.points === element.points
                );
                resolve({ selectedTemplate, imageObject, matchedIndex });
              };
              imageObject.onerror = reject;
            });
          }
        );
        await Promise.all(imagePromises).then((loadedImages: any) => {
          loadedImages.sort(
            (a: any, b: any) => a.matchedIndex - b.matchedIndex
          );
          let newElements = [...elements];
          let numImagesAdded = 0;
          loadedImages.forEach(
            ({ selectedTemplate, imageObject, matchedIndex }: any) => {
              const newElement = {
                clipElement: selectedTemplate,
                image: imageObject,
                type: "image",
                width: imageObject.width,
                height: imageObject.height,
              };
              newElements = [
                ...newElements.slice(0, matchedIndex + numImagesAdded + 1),
                newElement,
                ...newElements.slice(
                  newElements[matchedIndex + numImagesAdded + 1]?.type ===
                    "image"
                    ? matchedIndex + numImagesAdded + 2
                    : matchedIndex + numImagesAdded + 1
                ),
              ];
              numImagesAdded++;
            }
          );
          setElements(
            newElements?.map((element, index) => ({ ...element, id: index }))
          );
        });
        setSynthElementMove(undefined);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handlePatternClear = () => {
    setClear(true);
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
    if (action === "writing") {
      textAreaElement?.focus();
      (textAreaElement as HTMLTextAreaElement).value = selectedElement?.text!;
    }
  }, [tool, action, selectedElement]);

  useLayoutEffect(() => {
    if (clear) {
      const newElements = lodash.filter(elements, (element: SvgPatternType) => {
        if (
          element.type === "0" ||
          element.type === "1" ||
          element.type === "2"
        ) {
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
        null,
        null,
        (e.target as HTMLFormElement)?.value
      );
    }
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
      elements?.forEach((element: SvgPatternType) => {
        if (action === "writing" && selectedElement?.id === element.id) {
          return;
        }
        if (
          element.type === "image" ||
          element.type === "pattern" ||
          element.type === "circle"
        ) {
          drawPatternElement(element, ctx);
        } else {
          // drawElement(element, ctx, zoom, canvas!);
        }
      });
      ctx.save();
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
  ]);

  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventZoom, { passive: false });

    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener("touchmove", preventZoom);

      if (canvas) {
        canvas.removeEventListener("wheel", handleWheel);
      }
    };
  }, [canvas, handleWheel]);

  console.log({ elements });

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
  };
};

export default useCanvas;
