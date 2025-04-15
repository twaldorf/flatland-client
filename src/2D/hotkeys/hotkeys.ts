import { pushCommand, undoCommands } from "../../Command";
import { state } from "../../State";
import { SaveProjectCommand } from "../../UI/commands/SaveProjectCommand";
import { ChangeToolCommand } from "../commands/ChangeToolCommand";
import { DeleteCommand } from "../commands/DeleteCommand";
import { SelectToolDeselectAllCommand } from "../commands/SelectToolDeselectAllCommand";
import { drawCanvasFromState } from "../rendering/canvas";

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
    
    case "z":
      undoCommands();
      break;

    case "s":
      if (e.metaKey) {
        e.preventDefault();
        pushCommand(new SaveProjectCommand());
      }
      break;

    case "Alt":
      state.altDown = true;
      break;

    case "Escape":
      pushCommand(new ChangeToolCommand("select"));
      pushCommand(new SelectToolDeselectAllCommand());
      break;

    default:
      break;
  }
};

export const handleKeyUp = (e: KeyboardEvent) => {
  switch (e.key) {
    case "Shift":
      state.shiftDown = false;
      break;

    case "Alt":
      state.altDown = false;

    default:
      break;
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
