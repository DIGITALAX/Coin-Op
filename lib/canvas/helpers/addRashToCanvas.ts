import convertSvgToPath from "./convertSVGToPath";

const addRashToCanvas = async (
  setElements: (
    patternId: string,
    action: any,
    overwrite?: boolean | undefined,
    resize?: boolean | undefined
  ) => void,
  image: string,
  id: number,
  canvas: HTMLCanvasElement,
  elements?: any[],
  canvasSize?: any
) => {
  try {
    const { subpaths, bbox, circle } = await convertSvgToPath(image, 1);
    const bounds = canvas?.getBoundingClientRect();
    const bboxWidth = bbox.xMax - bbox.xMin;
    const bboxHeight = bbox.yMax - bbox.yMin;
    const scaleFactorX = canvas.width / bboxWidth;
    const scaleFactorY = canvas.height / bboxHeight;

    const newElement = {
      id: 0,
      points: subpaths.map((subpath) =>
        subpath.map((point) => ({
          x: ((point.x - bbox.xMin) * scaleFactorX) / devicePixelRatio,
          y: ((point.y - bbox.yMin) * scaleFactorY) / devicePixelRatio,
        }))
      ),
      type: circle ? "circle" : "pattern",
      posX: 0,
      posY: 0,
      stroke: "#ffc800",
      scaleFactorX,
      scaleFactorY,
      bounds: {
        left: bounds.left,
        top: bounds.top,
      },
    };

    if (!elements) {
      setElements(String(id), [newElement]);
    } else {
      if (
        scaleFactorX === elements[0].scaleFactorX &&
        scaleFactorY === elements[0].scaleFactorY
      )
        return;
      setElements(
        String(id),
        elements?.map((element, index: number) => {
          if (index === 0) {
            return newElement;
          } else {
            if (element.type === "text") {
              return {
                ...element,
                x1: (element.x1 * canvasSize.width) / canvasSize.oldWidth,
                x2: (element.x2 * canvasSize.width) / canvasSize.oldWidth,
                y1: (element.y1 * canvasSize.height) / canvasSize.oldHeight,
                y2: (element.y2 * canvasSize.height) / canvasSize.oldHeight,
              };
            } else {
              return {
                ...element,
                points: element.points?.map(
                  (point: { x: number; y: number }) => {
                    return {
                      x: (point.x * canvasSize.width) / canvasSize.oldWidth,
                      y: (point.y * canvasSize.height) / canvasSize.oldHeight,
                    };
                  }
                ),
              };
            }
          }
        }),
        false,
        true
      );
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default addRashToCanvas;
