import { SvgPatternType } from "@/components/Walkthrough/Synth/types/synth.types";

export const getRegionOfInterest = (
  element: SvgPatternType
): { x: number; y: number; width: number; height: number } | null => {
  let minX: number = 0,
    minY: number = 0,
    maxX: number = 0,
    maxY: number = 0;

  if (!element || !element.points) return null;

  for (const path of element?.points!) {
    for (let i = 0; i < path.length; i++) {
      if (i === 0) {
        minX = path[i]?.x;
        maxX = path[i]?.x;
        minY = path[i]?.y;
        maxY = path[i]?.y;
      } else {
        minX = Math.min(minX, path[i]?.x);
        maxX = Math.max(maxX, path[i]?.x);
        minY = Math.min(minY, path[i]?.y);
        maxY = Math.max(maxY, path[i]?.y);
      }
    }
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const scaleFactor = element.type === "circle" ? 3 : 10;

  return {
    x: centerX - ((maxX - minX) * scaleFactor) / 2,
    y: centerY - ((maxY - minY) * scaleFactor) / 2,
    width: (maxX - minX) * scaleFactor,
    height: (maxY - minY) * scaleFactor,
  };
};
