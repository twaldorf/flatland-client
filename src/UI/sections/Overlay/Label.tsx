import { CiCircleRemove, CiEdit } from "react-icons/ci";
import { useAppState } from "../../AppState";
import { ChangeToolCommand } from "../../../2D/commands/ChangeToolCommand";
import { pushCommand } from "../../../Command";
import { useRef } from "react";
import "./overlay.css";


// Individual piece detail view
const Label = () => {
  const label = useAppState((state) => state.label);
  const clearLabel = useAppState((state) => state.clearLabel);
  const expanded = useAppState((state) => state.expandedLabel);
  const expandLabel = useAppState((state) => state.expandLabel);
  const minimizeLabel = useAppState((state) => state.minimizeLabel);

  const grainlineRef = useRef(null);
  const labelRef = useRef(null);

  const handleGrainlineClick = () => {
    pushCommand(new ChangeToolCommand('grainline'));
  }

  if (!label) return null; // Don't render if there's no label

  const { point, piece } = label;

  return (
    <div
      className="absolute gap-2 bg-gray-800 text-white px-3 py-2 rounded shadow-md"
      ref={labelRef}
      style={{
        left: `${Math.max(12, point.x / 2)}px`,
        top: `${Math.max(0, point.y / 2)}px`,
        transform: "translate(0, -100%)", // Centers above the point
      }}
    >
      <div className="flex flex-row align-center">
        <h4 className="m-auto h-min">{piece.quantity ? piece.quantity : 1}x</h4>
        <p className="text-sm font-medium flex flex-row m-auto h-min">{piece.name}<CiEdit className="text-2xl"></CiEdit></p>
        <ul className="actionButtons">
          <button>Stash</button>
          <button>Clone</button>
          <button>Copy</button>
          <button>Trash</button>
        </ul>
        <button ref={grainlineRef}
          className="flex flex-row items-center text-sm p-2 border border-white focus:border-blue-500 focus:border rounded-sm"
          onClick={handleGrainlineClick}
          >
          Grainline
        </button>
        <button
          className="text-2xl hover:text-red-300"
          onClick={clearLabel}
          >
          <CiCircleRemove strokeWidth=".5" />
        </button>
      </div>
      <div>
        
        <label htmlFor="properties">Properties</label>
        <ul id="properties">

        </ul>
      </div>
    </div>
  );
};

export default Label;
