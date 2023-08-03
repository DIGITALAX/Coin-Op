import createElement from "./createElement";

const updateElement = (
  pan: {
    xOffset: number;
    yOffset: number;
  },
  canvas: HTMLCanvasElement,
  zoom: number,
  elements: any,
  setElements: (patternId: string, action: any, overwrite?: boolean) => void,
  patternId: string,
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number | null,
  y2: number | null,
  type: string | null,
  index: number,
  strokeWidth: number | null,
  fill: string | null,
  text?: string,
  font?: string
) => {
  const elementsCopy = [...(elements || [])];
  const bounds = canvas?.getBoundingClientRect();
  switch (type) {
    case "erase":
    case "pencil":
      elementsCopy[index].points = [
        ...(elementsCopy[index]?.points as any),
        {
          x: ((x2! - bounds?.left - pan.xOffset) / zoom) * devicePixelRatio,
          y: ((y2! - bounds?.top - pan.yOffset) / zoom) * devicePixelRatio,
        },
      ];
      elementsCopy[index].canvasWidth = canvas.width;
      elementsCopy[index].canvasHeight = canvas.height;
      break;

    case "text":
      (ctx as CanvasRenderingContext2D).font = `${
        strokeWidth! * devicePixelRatio
      }px ${font}`;
      const textWidth = ctx?.measureText(text!).width!;
      const textHeight = ctx?.measureText("M").width! / 2;
      elementsCopy[index] = {
        ...createElement(
          {
            xOffset: pan.xOffset,
            yOffset: pan.yOffset,
          },
          canvas,
          zoom,
          x1,
          y1,
          x1! + textWidth * zoom,
          y1! + textHeight! * zoom,
          type,
          index,
          strokeWidth!,
          fill!,
          font,
        ),
        text,
      };
      break;
  }
  setElements(patternId, elementsCopy, true);
};

export default updateElement;
