
import { cOnMouseEnter } from "./cOnMouseEnter";
import { cOnMouseLeave } from "./cOnMouseLeave";

export const initializeCanvasEvents = (canvas: HTMLCanvasElement) => {
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  canvas.addEventListener("mouseenter", cOnMouseEnter);
  canvas.addEventListener("mouseleave", cOnMouseLeave);
  // canvas.addEventListener("mousedown", debugEvent);
};

const debugEvent = (e:MouseEvent) => {
  console.log(e)
}