import { WheelEvent } from "react";

const wheelLogic = (
  e: WheelEvent,
  zoom: number,
  setZoom: (e: number) => void,
  canvasState: HTMLCanvasElement,
  pan: {
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  },
  setPan: (e: {
    xInitial: number;
    yInitial: number;
    xOffset: number;
    yOffset: number;
  }) => void,
  maxZoom: number
) => {
  const zoomFactor = 1 + e.deltaY / 100;
  const mouseX = canvasState.width / 2;
  const mouseY = canvasState.height / 2;
  let newZoom = Math.min(Math.max(zoom * zoomFactor, 1), maxZoom);
  const x = mouseX / zoom - pan.xOffset / zoom;
  const y = mouseY / zoom - pan.yOffset / zoom;
  let newXOffset = mouseX - x * newZoom;
  let newYOffset = mouseY - y * newZoom;

  requestAnimationFrame(() => {
    setZoom(newZoom);
    setPan({
      xInitial: pan.xInitial,
      yInitial: pan.yInitial,
      xOffset: newXOffset,
      yOffset: newYOffset,
    });
  });
};

export default wheelLogic;
