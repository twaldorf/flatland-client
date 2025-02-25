import { pushCommand } from "../../Command";
import { state } from "../../State";
import { DeleteCommand } from "../commands/DeleteCommand";

export const handleKeyDown = (e: KeyboardEvent) => {
  if (e.repeat) return; // Ignore repeated keydown events

  switch (e.key) {
    case "Backspace":
    case "Delete":
      e.preventDefault();
      handleDelete(e);
      break;
    
    case "Shift":
      state.shiftDown = true; // Track shift for multi-selection
      break;

    default:
      break;
  }
};

export const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === "Shift") {
    state.shiftDown = false;
  }
};

const handleDelete = (e:KeyboardEvent) => {
  state.tool.onKeyDown(e);
};


// Attach event listeners when the app initializes
export const initializeHotkeys = () => {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
};

// Call this function in your app startup logic
