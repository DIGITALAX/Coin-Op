import { SvgPatternType } from "@/components/Walkthrough/Synth/types/synth.types";

export const isPointInPattern = (
  x: number,
  y: number,
  element: SvgPatternType,
  ctx: CanvasRenderingContext2D,
  zoom: number,
  pan: {
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  }
): boolean => {
  let isInPath = false;
  for (const path of element.points!) {
    ctx.save();
    ctx.beginPath();

    let minX = path[0]?.x,
      maxX = path[0]?.x,
      minY = path[0]?.y,
      maxY = path[0]?.y;

    for (let i = 1; i < path.length; i++) {
      minX = Math.min(minX, path[i]?.x);
      maxX = Math.max(maxX, path[i]?.x);
      minY = Math.min(minY, path[i]?.y);
      maxY = Math.max(maxY, path[i]?.y);
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    ctx?.translate(centerX, centerY);
    ctx?.scale(10, 10);
    ctx?.translate(-centerX, -centerY);

    ctx.moveTo(path[0]?.x, path[0]?.y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i]?.x, path[i]?.y);
    }
    ctx.closePath();

    const mouseEventX = x * devicePixelRatio;
    const mouseEventY = y * devicePixelRatio;

    if (ctx.isPointInPath(mouseEventX, mouseEventY)) {
      isInPath = true;
    }
    ctx.restore();
  }

  return isInPath;
};
