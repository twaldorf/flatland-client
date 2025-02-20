import { state } from "../../State";
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
};
