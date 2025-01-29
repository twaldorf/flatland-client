import { state } from "../../State";

export const cOnMouseEnter = (e:MouseEvent) => {
  console.log('active')
  state.cActive = true;
}