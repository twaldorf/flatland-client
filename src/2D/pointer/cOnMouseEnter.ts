import { state } from "../../State";

export const cOnMouseEnter = (e:MouseEvent) => {
  state.cActive = true;
}