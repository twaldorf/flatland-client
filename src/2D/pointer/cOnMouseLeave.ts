import { state } from "../../State";

export const cOnMouseLeave = (e:MouseEvent) => {
  state.cActive = false;
}