import { useAppState } from "../../store";


const Label = () => {
  const label = useAppState((state) => state.label);
  const clearLabel = useAppState((state) => state.clearLabel);

  if (!label) return null; // Don't render if there's no label

  const { point, piece } = label;

  console.log(label)

  return (
    <div
      className="absolute bg-gray-800 text-white px-3 py-2 rounded shadow-md"
      style={{
        left: `${point.x / 2}px`,
        top: `${point.y / 2}px`,
        // transform: "translate(-50%, -100%)", // Centers above the point
      }}
    >
      <p className="text-sm font-medium">{piece.name}</p>
      <p className="text-xs text-gray-400">Shape #{piece.shapeIndex}</p>
      <button
        className="mt-1 text-xs text-blue-400 hover:text-blue-300"
        onClick={clearLabel}
      >
        Close
      </button>
    </div>
  );
};

export default Label;
