import { State } from "../types";

// Localize the current pointer within the correct canvas
interface PointerLocalizationBundle {
  event:MouseEvent;
  state:State;
  domElement:HTMLElement;
}

export const localizePointerTo = ({ event, state, domElement }:PointerLocalizationBundle):void => {
  state.rawPointer.rx = event.clientX;
  state.rawPointer.ry = event.clientY;

  state.pointer.x = 2 * (window.innerWidth / domElement.offsetWidth) * 
  ( event.clientX - state.renderer.domElement.getBoundingClientRect().x ) 
  / ( window.innerWidth ) - 1;

  state.pointer.y = -2 * (window.innerHeight / domElement.offsetHeight) * 
  ( event.clientY - state.renderer.domElement.getBoundingClientRect().y ) 
  / ( window.innerHeight ) + 1;
}