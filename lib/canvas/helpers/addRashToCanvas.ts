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
      setElements(String(id), [newElement], false, false);
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
            const isScalingDown =
              canvasSize!.width <
              (canvasSize!.oldWidth === 0
                ? canvasSize!.width
                : canvasSize!.oldWidth);
            let scaleFactorWidth, scaleFactorHeight;
            scaleFactorWidth =
              canvasSize!.width /
              (canvasSize!.oldWidth === 0
                ? canvasSize!.width
                : canvasSize!.oldWidth);
            scaleFactorHeight =
              canvasSize!.height /
              (canvasSize!.oldHeight === 0
                ? canvasSize!.height
                : canvasSize!.oldHeight);

            const scaleFactor = Math.sqrt(scaleFactorWidth * scaleFactorHeight);
            if (element.type === "image") {
              return {
                ...element,
                // x1: element.x1 * scaleFactorSize + offsetX,
                // y1: element.y1 * scaleFactorSize + offsetY,
                // width: element.width * scaleFactorSize + offsetX,
                // height: element.height * scaleFactorSize + offsetY,
              };
            } else if (element.type === "text") {
              const scaleFactorSizeText = isScalingDown
                ? Math.max(scaleFactorWidth, scaleFactorHeight)
                : Math.min(scaleFactorWidth, scaleFactorHeight);

              const widthBefore = element.x2 - element.x1;
              const heightBefore = element.y2 - element.y1;

              const widthAfter = widthBefore * scaleFactorSizeText;
              const heightAfter = heightBefore * scaleFactorSizeText;
              const offsetXText =
                (canvasSize!.width -
                  (canvasSize!.oldWidth === 0
                    ? canvasSize!.width
                    : canvasSize!.oldWidth) *
                    scaleFactorSizeText) /
                2;
              const offsetYText =
                (canvasSize!.height -
                  (canvasSize!.oldHeight === 0
                    ? canvasSize!.height
                    : canvasSize!.oldHeight) *
                    scaleFactorSizeText) /
                2;

              const x1New = element.x1 * scaleFactorSizeText + offsetXText;
              const y1New = element.y1 * scaleFactorSizeText + offsetYText;

              return {
                ...element,
                x1: x1New,
                y1: y1New,
                x2: x1New + widthAfter,
                y2: y1New + heightAfter,
                strokeWidth: element.strokeWidth * scaleFactor,
              };
            } else {
              const scaleFactorSizePolygon = isScalingDown
                ? Math.min(scaleFactorWidth, scaleFactorHeight)
                : Math.max(scaleFactorWidth, scaleFactorHeight);

              const offsetXPolygon =
                (canvasSize!.width -
                  (canvasSize!.oldWidth === 0
                    ? canvasSize!.width
                    : canvasSize!.oldWidth) *
                    scaleFactorSizePolygon) /
                2;
              const offsetYPolygon =
                (canvasSize!.height -
                  (canvasSize!.oldHeight === 0
                    ? canvasSize!.height
                    : canvasSize!.oldHeight) *
                    scaleFactorSizePolygon) /
                2;

              return {
                ...element,
                strokeWidth: element.strokeWidth * scaleFactor,
                points: element.points?.map(
                  (point: { x: number; y: number }) => {
                    return {
                      x: point.x * scaleFactorSizePolygon + offsetXPolygon,
                      y: point.y * scaleFactorSizePolygon + offsetYPolygon,
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
