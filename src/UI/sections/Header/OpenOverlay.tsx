// components/Overlays/OpenProjectOverlay.tsx
import { useEffect, useState } from "react"
import { state } from "../../../State"
import { drawCanvasFromState } from "../../../2D/rendering/canvas";
import { useAppState } from "../../store";


export const OpenProjectOverlay = () => {
  const [keys, setKeys] = useState<string[]>([]);
  const open = useAppState(s => s.modal);
  const hideModal = useAppState(s => s.hideModal);

  useEffect(() => {
    const project_list = localStorage.getItem('flatland-projects');
    if (project_list) {
      const savedKeys = JSON.parse(project_list)
        .filter(k => k.startsWith("flatland-project-"));
      setKeys(savedKeys);
    }
  }, []);

  const loadProject = (key: string) => {
    const json = localStorage.getItem(key)
    console.log(json)
    if (!json) return
    const data = json;
    state.deserialize(data);
    drawCanvasFromState(state);
    hideModal();
  }

  if (open === 'Open Project') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Open Project</h2>
          {keys.length === 0 ? (
            <p className="text-gray-500">No saved projects.</p>
          ) : (
            <ul className="space-y-2">
              {keys.map(key => (
                <li key={key}>
                  <button
                    className="w-full text-left px-4 py-2 rounded bg-stone-100 hover:bg-stone-200"
                    onClick={() => loadProject(key)}
                  >
                    {key.replace("flatland-project-", "")}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            className="mt-4 text-sm text-blue-500 hover:underline"
            onClick={hideModal}
          >
            Cancel
          </button>
        </div>
      </div>
    )}

  else {
    return null;
  }
}
