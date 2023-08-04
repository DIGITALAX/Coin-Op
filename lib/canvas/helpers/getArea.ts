import { SvgPatternType } from "@/components/Walkthrough/Synth/types/synth.types";

export const getArea = (
  element: SvgPatternType
): {
  xMin: number;
  yMin: number;
  width: number;
  height: number;
} => {
  const xValues = element.points![0].flat().map((point) => point.x);
  const yValues = element.points![0].flat().map((point) => point.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  return { xMin, yMin, width: xMax - xMin, height: yMax - yMin };
};
