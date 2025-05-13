import { Vector2 } from "three";
import { useAppState } from "../../AppState";

export const ShapeInfo = () => {
  const points = useAppState((state) => state.shapePoints);
  const updatePoint = useAppState((state) => state.updatePoint);
  const deletePoint = useAppState((state) => state.deletePoint);
  const insertPoint = useAppState((state) => state.insertPoint);
  const toolName = useAppState((state) => state.selectedTool);

  if (!points || points.length === 0 || toolName != 'path') return null;

  return (
    <ul
      className="absolute box-border bottom-3 left-3 right-3 flex flex-row flex-nowrap items-center bg-blue-300 text-white rounded-md text-xs p-1 max-w-7/10 overflow-x-auto"
      style={{ zIndex: 20 }}
    >
      {points.map((point: Vector2, index: number) => (
        <div key={index} className="flex items-center mx-1 space-x-1">
          {/* Point Editor */}
          <li className="flex flex-col whitespace-nowrap bg-blue-400 p-1 rounded">
            <div className="flex items-center">
              <label className="mr-1 text-blue-100">x{index + 1}:</label>
              <input
                type="number"
                className="w-12 text-black rounded text-white"
                value={point.x}
                onChange={(e) =>
                  updatePoint(index, new Vector2(+e.target.value, point.y))
                }
              />
            </div>
            <div className="flex items-center mt-1">
              <label className="mr-1 text-blue-100">y{index + 1}:</label>
              <input
                type="number"
                className="w-12 text-black rounded text-white"
                value={point.y}
                onChange={(e) =>
                  updatePoint(index, new Vector2(point.x, +e.target.value))
                }
              />
            </div>
          </li>

          {/* Delete Button */}
          <button
            onClick={() => deletePoint(index)}
            className="text-white hover:text-red-700 text-sm font-bold"
            title="Delete Point"
          >
            ✕
          </button>

          {/* Insert Point Button */}
          {index < points.length - 1 && (
            <button
              onClick={() =>
                insertPoint(index, new Vector2((point.x + points[index + 1].x) / 2, (point.y + points[index + 1].y) / 2))
              }
              className="text-blue-200 hover:text-white text-sm font-bold"
              title="Insert Point"
            >
              ＋
            </button>
          )}
        </div>
      ))}
      {/* Final “Add Point” button at end */}
      <button
        onClick={() => insertPoint(points.length - 1, new Vector2(0, 0))}
        className="text-blue-100 hover:text-white text-sm font-bold mx-1"
      >
        ＋ Point
      </button>
    </ul>
  );
};
