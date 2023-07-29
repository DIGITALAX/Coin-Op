import { Point2 } from "@/components/Walkthrough/Synth/types/synth.types";

const distance = (a: Point2, b: Point2) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

export default distance;
