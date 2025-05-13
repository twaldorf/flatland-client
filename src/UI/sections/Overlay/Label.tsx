import { CiCircleRemove, CiEdit } from "react-icons/ci";
import { useAppState } from "../../AppState";
import { ChangeToolCommand } from "../../../2D/commands/ChangeToolCommand";
import { pushCommand } from "../../../Command";
import { useRef } from "react";


const Label = () => {
  const label = useAppState((state) => state.label);
  const clearLabel = useAppState((state) => state.clearLabel);

  const grainlineRef = useRef(null);
  const labelRef = useRef(null);

  const handleGrainlineClick = () => {
    pushCommand(new ChangeToolCommand('grainline'));
  }

  if (!label) return null; // Don't render if there's no label

  const { point, piece } = label;

  return (
    <div
      className="absolute gap-2 flex flex-row bg-gray-800 text-white px-3 py-2 rounded shadow-md"
      ref={labelRef}
      style={{
        left: `${Math.max(12, point.x / 2)}px`,
        top: `${Math.max(0, point.y / 2)}px`,
        transform: "translate(0, -100%)", // Centers above the point
      }}
    >
      <div>
        <p className="text-sm font-medium">{piece.name}</p>
        <p className="text-xs text-gray-400">Shape #{piece.shapeIndex}</p>
      </div>
      <button ref={grainlineRef}
        className="flex flex-row items-center text-sm p-2 border border-white focus:border-blue-500 focus:border rounded-sm"
        onClick={handleGrainlineClick}
      >
        Grainline
        <CiEdit className="text-2xl"></CiEdit>
      </button>
      <button
        className="text-2xl hover:text-red-300"
        onClick={clearLabel}
      >
        <CiCircleRemove strokeWidth=".5" />
      </button>
    </div>
  );
};

export default Label;
