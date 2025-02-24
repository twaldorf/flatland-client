import { state } from "../../State";
import { getBuffer } from "./getBuffer";
import { path1, path2 } from "../icons/plus_path";

// TODO: this reaches quite far into state and produces significant business logic
// Ideally this would remain part of the drawing layer and simply read which hover state is most appropriate
// ToolState could include a hoverstate type and be responsible for such things. 
// Or there could be a state interpreter which is called each time state changes in the tools
export const drawCursorPreview = (pointer:unknown) => {
  const { context, canvas } = getBuffer('cursor_preview');

  // TODO: #optimization: make this a small canvas, draw it only at the pointer
  canvas.width = 24;
  canvas.height = 24;

  
  // state.context.drawImage(canvas, 0, 0);
  switch (state.tool.state.type) {
    case "drawing":
      context.stroke(path1);
      context.stroke(path2);
      break;
    
    case "drawing new point":
      context.stroke(path1);
      context.stroke(path2);
      break;

    default:
      break;
  }
}

export function applyCursorPreview() {
  const obj = state.c_buffers.get('cursor_preview');
  if (obj) state.context.drawImage(obj.canvas, state.pointer.x + 10, state.pointer.y - 20);

}