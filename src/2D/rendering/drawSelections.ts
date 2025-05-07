import { state } from "../../State";
import { State } from "../../types";
import { LineHit } from "../geometry/lineIntersection";
import { rad } from "../settings/interface";
import { getBuffer } from "./getBuffer";

export const drawSelections = (state:State) => {
  const { context, canvas } = getBuffer('selections');

  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  // TODO
  // state.c_selected.map((index: number) => {
  //   context.fillStyle = 'black';
  //   context.strokeStyle = 'black';
  //   context.beginPath();
  //   context.arc(state.c_points[index].x - rad / 2 + 2, state.c_points[index].y - rad / 2 + 2, rad, 0, 2 * Math.PI);
  //   context.fill();
  //   context.stroke();
  // });


  // state.c_selected_lines.map((hit:LineHit) => {
  //   const shapeArr = state.c_shapes[hit.shapeIndex];
  //   const i1 = shapeArr[hit.lineStartIndex];
  //   const i2 = shapeArr[(hit.lineStartIndex + 1) % (shapeArr.length - 1)];
  //   const point1 = state.c_pointmap.get(i1);
  //   const point2 = state.c_pointmap.get(i2);
  //   if (point1 && point2) {
  //     context.moveTo(point1.x, point1.y);
  //     context.lineTo(point2.x, point2.y);
  //     context.strokeStyle = 'blue';
  //     context.lineWidth = 10;
  //     context.stroke(); 
  //   }
  // })

  state.context.drawImage(canvas, 0, 0);
};
