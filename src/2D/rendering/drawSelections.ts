import { state } from "../../State";
import { LineHit } from "../geometry/lineIntersection";
import { rad } from "../settings/interface";

export const drawSelections = () => {
  state.c_selected.map((index: number) => {
    state.context.fillStyle = 'black';
    state.context.strokeStyle = 'black';
    state.context.beginPath();
    state.context.arc(state.c_points[index].x - rad / 2 + 2, state.c_points[index].y - rad / 2 + 2, rad, 0, 2 * Math.PI);
    state.context.fill();
    state.context.stroke();
  });

  console.log(state.c_selected_lines)
  state.c_selected_lines.map((hit:LineHit) => {
    const shapeArr = state.c_shapes[hit.shapeIndex];
    const i1 = shapeArr[hit.lineStartIndex];
    const i2 = shapeArr[(hit.lineStartIndex + 1) % (shapeArr.length - 1)];
    const point1 = state.c_pointmap.get(i1);
    const point2 = state.c_pointmap.get(i2);
    if (point1 && point2) {
      state.context.moveTo(point1.x, point1.y);
      state.context.lineTo(point2.x, point2.y);
      state.context.strokeStyle = 'blue';
      state.context.lineWidth = 10;
      state.context.stroke(); 
    }
  })
};
