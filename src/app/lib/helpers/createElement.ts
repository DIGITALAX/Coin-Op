import { ElementInterface } from "@/app/components/Walkthrough/types/walkthrough.types";


const createElement = (
  pan: { xOffset: number; yOffset: number },
  canvas: HTMLCanvasElement,
  zoom: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string,
  id: number,
  strokeWidth?: number,
  fill?: string,
  font?: string,
): ElementInterface | undefined => {
  const bounds = canvas?.getBoundingClientRect();
  switch (type) {
    case "erase":
    case "pencil":
      return {
        id,
        type,
        points: [
          {
            x: ((x1 - bounds?.left - pan.xOffset) / zoom) * devicePixelRatio,
            y: ((y1 - bounds?.top - pan.yOffset) / zoom) * devicePixelRatio,
          },
        ],
        fill,
        strokeWidth
      };
    case "text":
      return {
        id,
        type,
        x1: x1 - bounds?.left,
        y1: y1 - bounds?.top,
        x2: x2 - bounds?.left,
        y2: y2 - bounds?.top,
        fill,
        strokeWidth,
        text: "",
        font,
      };
  }
};

export default createElement;
