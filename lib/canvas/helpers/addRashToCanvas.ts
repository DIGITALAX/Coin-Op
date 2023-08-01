import { SvgPatternType } from "@/components/Walkthrough/Synth/types/synth.types";
import convertSvgToPath from "./convertSVGToPath";

const addRashToCanvas = async (
  setElements: (
    patternId: string,
    action: any,
    overwrite?: boolean | undefined
  ) => void,
  image: string,
  id: number,
  canvas: HTMLCanvasElement
) => {
  try {
    const { subpaths, bbox, circle } = await convertSvgToPath(image, 1);

    const bboxWidth = bbox.xMax - bbox.xMin;
    const bboxHeight = bbox.yMax - bbox.yMin;
    const scaleFactorX = canvas.width / bboxWidth;
    const scaleFactorY = canvas.height / bboxHeight;

    setElements(String(id), [
      {
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
      },
    ]);
  } catch (err: any) {
    console.error(err.message);
  }
};

export default addRashToCanvas;
