import getStroke from "perfect-freehand";
import getSvgPathFromStroke from "./getSvgPathFromStroke";
import { ElementInterface } from "@/components/Walkthrough/Synth/types/synth.types";

const drawElement = (
  element: ElementInterface,
  ctx: CanvasRenderingContext2D | null,
  materialBackground: string,
  synth?: boolean
) => {
  ctx?.setLineDash(element?.lineDash ? element?.lineDash : [0]);
  (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;
  ctx?.save();

  switch (element?.type) {
    case "erase":
    case "pencil":
      ctx?.beginPath();
      if (synth && element?.type === "erase") {
        ctx!.globalCompositeOperation = "destination-out";
      } else {
        ctx!.globalCompositeOperation = "source-over";
        (ctx as CanvasRenderingContext2D).fillStyle =
          element?.type === "erase"
            ? materialBackground
            : (element?.fill as string);
      }

      const pathData = getSvgPathFromStroke(
        getStroke(element?.points as { x: number; y: number }[], {
          size: (element?.strokeWidth as number) * devicePixelRatio,
        })
      );
      ctx?.fill(new Path2D(pathData));
      ctx?.closePath();
      break;

    case "text":
      ctx?.beginPath();
      (ctx as CanvasRenderingContext2D).textBaseline = "top";
      (ctx as CanvasRenderingContext2D).font = `${
        (element.strokeWidth as number) * devicePixelRatio
      }px ${element.font}`;
      (ctx as CanvasRenderingContext2D).fillStyle = element.fill as string;
      (ctx as CanvasRenderingContext2D).fillText(
        (element.text as string) !== undefined ? (element.text as string) : "",
        element.x1 as number,
        element.y1 as number
      );
      ctx?.closePath();
      break;
  }
};

export default drawElement;
