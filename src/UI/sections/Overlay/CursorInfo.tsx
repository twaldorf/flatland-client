import { useAppState } from "../../store";

const CursorInfo = () => {
  const pointerX = useAppState((state) => state.pointer.x);
  const pointerY = useAppState((state) => state.pointer.y);
  const toolName = useAppState((state) => state.tool.name);

  return (
    <div className="absolute bg-gray-800 text-white px-2 py-1 text-xs rounded shadow-md pointer-events-none bottom-0 right-0">
      <p>Tool: {toolName}</p>
      <p>X: {Math.round(pointerX)}</p>
      <p>Y: {Math.round(pointerY)}</p>
    </div>
  );
};

export default CursorInfo;
