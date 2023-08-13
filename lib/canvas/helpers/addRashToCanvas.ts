import { AnyAction, Dispatch } from "redux";
import convertSvgToPath from "./convertSVGToPath";
import { setSynthArea } from "../../../redux/reducers/synthAreaSlice";
import { getArea } from "./getArea";

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
  dispatch: Dispatch<AnyAction>,
  elements?: any[],
  canvasSize?: {
    width: number;
    height: number;
    oldWidth: number;
    oldHeight: number;
  }
) => {
  try {
    const { subpaths, bbox, circle } = await convertSvgToPath(image, 1);
    const bounds = canvas?.getBoundingClientRect();
    const bboxWidth = bbox.xMax - bbox.xMin;
    const bboxHeight = bbox.yMax - bbox.yMin;
    const scaleFactorX = canvas.width / bboxWidth;
    const scaleFactorY = canvas.height / bboxHeight;
    const scaleFactor = Math.min(scaleFactorX, scaleFactorY);

    const newElement = {
      id: 0,
      points: subpaths.map((subpath) =>
        subpath.map((point) => ({
          x: ((point.x - bbox.xMin) * scaleFactor) / devicePixelRatio,
          y: ((point.y - bbox.yMin) * scaleFactor) / devicePixelRatio,
        }))
      ),
      type: circle ? "circle" : "pattern",
      posX: 0,
      posY: 0,
      stroke: "#ffc800",
      scaleFactorX: scaleFactor,
      scaleFactorY: scaleFactor,
      bounds: {
        left: bounds.left,
        top: bounds.top,
      },
    };

    const newBBox = getArea(newElement);
    let originalWidth = newBBox.width / devicePixelRatio;
    let originalHeight = newBBox.height / devicePixelRatio;

    let scale = 768 / Math.min(originalWidth, originalHeight);
    let width = scale * originalWidth;
    let height = scale * originalHeight;

    if (width > 1080 || height > 1080) {
      if (width > height) {
        scale = 1080 / width;
        width = 1080;
        height = 768;
      } else {
        scale = 1080 / height;
        height = 1080;
        width = 768;
      }
    }

    dispatch(
      setSynthArea({
        width,
        height,
        originalWidth,
        originalHeight,
      })
    );

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
            const isScalingDown = canvasSize!.width < canvasSize!.oldWidth;
            let scaleFactorWidth, scaleFactorHeight;

            // Always compute the direct scaling factors
            scaleFactorWidth = canvasSize!.width / canvasSize!.oldWidth;
            scaleFactorHeight = canvasSize!.height / canvasSize!.oldHeight;

            const scaleFactor = Math.sqrt(scaleFactorWidth * scaleFactorHeight);
            const scaleFactorSize = isScalingDown
              ? Math.max(scaleFactorWidth, scaleFactorHeight)
              : Math.min(scaleFactorWidth, scaleFactorHeight);

            const offsetX =
              (canvasSize!.width - canvasSize!.oldWidth * scaleFactorSize) / 2;
            const offsetY =
              (canvasSize!.height - canvasSize!.oldHeight * scaleFactorSize) /
              2;

            if (element.type === "image") {
              return {
                ...element,
                x1: element.x1 * scaleFactorSize + offsetX,
                y1: element.y1 * scaleFactorSize + offsetY,
                width: element.width * scaleFactorSize + offsetX,
                height: element.height * scaleFactorSize + offsetY,
              };
            } else if (element.type === "text") {
              return {
                ...element,
                x1: element.x1 * scaleFactorSize + offsetX,
                x2: element.x2 * scaleFactorSize + offsetX,
                y1: element.y1 * scaleFactorSize + offsetY,
                y2: element.y2 * scaleFactorSize + offsetY,
                strokeWidth: element.strokeWidth * scaleFactor,
              };
            } else {
              return {
                ...element,
                strokeWidth: element.strokeWidth * scaleFactor,
                points: element.points?.map(
                  (point: { x: number; y: number }) => {
                    return {
                      x: point.x * scaleFactorSize + offsetX,
                      y: point.y * scaleFactorSize + offsetY,
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
