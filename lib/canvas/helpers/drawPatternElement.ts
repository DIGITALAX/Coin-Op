import { SvgPatternType } from "@/components/Walkthrough/Synth/types/synth.types";

const drawPatternElement = (
  element: SvgPatternType,
  ctx: CanvasRenderingContext2D | null,
  zoom: number,
  tool: string,
  synthElementMove: SvgPatternType | null,
  synthElementSelect: SvgPatternType[] | null,
  promptLoading: boolean,
  filter?: boolean
) => {
  if (!filter) {
    ctx?.setLineDash([0, 0]);
    (ctx as CanvasRenderingContext2D).lineWidth = 0.3 * zoom;
    if (!promptLoading) {
      if (element.points === synthElementMove?.points && tool === "synth") {
        (ctx as CanvasRenderingContext2D).strokeStyle = "#f1d2ef";
      } else if (
        synthElementSelect?.some(
          (selectedElement) => selectedElement.points === element.points
        )
      ) {
        (ctx as CanvasRenderingContext2D).strokeStyle = "#aeeccf";
      } else {
        (ctx as CanvasRenderingContext2D).strokeStyle =
          element.stroke as string;
      }
    } else {
      if (
        synthElementSelect?.some(
          (selectedElement) => selectedElement.points === element.points
        )
      ) {
        (ctx as CanvasRenderingContext2D).strokeStyle = "#aeeccf";
      } else {
        (ctx as CanvasRenderingContext2D).strokeStyle =
          element.stroke as string;
      }
    }
  } else {
    (ctx as CanvasRenderingContext2D).lineWidth = 0.3 * zoom;
    // if (element.type === "2" || element.type === "1") {
    //   (ctx as CanvasRenderingContext2D).strokeStyle = "rgba(0, 0, 0, 0)";
    // }
  }

  (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;
  switch (element?.type) {
    case "circle":
      for (const subpath of element.points!) {
   

      // Calculate the center of the points
      let minXCircle = subpath[0].x,
        maxXCircle = subpath[0].x,
        minYCircle = subpath[0].y,
        maxYCircle = subpath[0].y;

      for (let i = 1; i < subpath.length; i++) {
        minXCircle = Math.min(minXCircle, subpath[i].x);
        maxXCircle = Math.max(maxXCircle, subpath[i].x);
        minYCircle = Math.min(minYCircle, subpath[i].y);
        maxYCircle = Math.max(maxYCircle, subpath[i].y);
      }

      // Calculate the center of the circle
      const centerXCircle = (minXCircle + maxXCircle) / 2;
      const centerYCircle = (minYCircle + maxYCircle) / 2;

      // Calculate the radius of the circle
      const radius =
        Math.max(maxXCircle - minXCircle, maxYCircle - minYCircle) / 2;

      // Draw the circle in the center of the canvas
      ctx?.beginPath();
      ctx?.save();
      ctx?.translate(centerXCircle, centerYCircle);
      ctx?.scale(3, 3);
      ctx?.translate(-centerXCircle, -centerYCircle);
      ctx?.arc(centerXCircle, centerYCircle, radius, 0, 2 * Math.PI, false);
      ctx?.stroke();
      ctx?.closePath();
      ctx?.restore();
    }
      break;

      case "pattern":
      for (const subpath of element.points!) {
        ctx?.beginPath();
        ctx?.save();

        // Calculate the center of the subpath points
        let minX = subpath[0].x,
          maxX = subpath[0].x,
          minY = subpath[0].y,
          maxY = subpath[0].y;

        for (let i = 1; i < subpath.length; i++) {
          minX = Math.min(minX, subpath[i].x);
          maxX = Math.max(maxX, subpath[i].x);
          minY = Math.min(minY, subpath[i].y);
          maxY = Math.max(maxY, subpath[i].y);
        }

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        // Move the center of the pattern to the origin, scale, then move back.
        ctx?.translate(centerX, centerY);
        ctx?.scale(10, 10);
        ctx?.translate(-centerX, -centerY);

        ctx?.moveTo(subpath[0].x, subpath[0].y);
        for (let i = 1; i < subpath.length; i++) {
          ctx?.lineTo(subpath[i].x, subpath[i].y);
        }

        ctx?.stroke();
        ctx?.closePath();
        ctx?.restore();
      }
      break;

    case "image":
      ctx?.save();
      ctx?.clip();
      if (typeof element.image === "string") {
        const img = new Image();
        img.src = element.image;
        img.onload = () => {
          ctx?.drawImage(
            img,
            ((element.clipElement as SvgPatternType)?.posX as number) *
              devicePixelRatio,
            ((element.clipElement as SvgPatternType)?.posY as number) *
              devicePixelRatio,
            (element?.width as number) * devicePixelRatio,
            (element?.height as number) * devicePixelRatio
          );
        };
      } else if (element.image instanceof HTMLImageElement) {
        ctx?.drawImage(
          element.image,
          ((element.clipElement as SvgPatternType)?.posX as number) *
            devicePixelRatio,
          ((element.clipElement as SvgPatternType)?.posY as number) *
            devicePixelRatio,
          (element?.width as number) * devicePixelRatio,
          (element?.height as number) * devicePixelRatio
        );
      }
      ctx?.restore();
      break;
  }
};

export default drawPatternElement;
