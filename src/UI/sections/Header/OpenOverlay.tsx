import { useEffect, useState } from "react"
import { pushCommand } from "../../../Command"
import { LoadProjectCommand } from "../../commands/LoadProjectCommand"
import { useAppState } from "../../AppState"

export const OpenProjectOverlay = () => {
  const [keys, setKeys] = useState<string[]>([])
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const open = useAppState(s => s.modal)
  const hideModal = useAppState(s => s.hideModal)

  useEffect(() => {
    const project_list = localStorage.getItem("flatland-projects")
    if (project_list) {
      const savedKeys = JSON.parse(project_list).filter((k: string) =>
        k.startsWith("flatland-project-")
      )
      setKeys(savedKeys)
    }
    setSelectedKey(null) // reset selection on open
  }, [open])

  const loadProject = () => {
    if (!selectedKey) return
    pushCommand(new LoadProjectCommand(selectedKey))
    hideModal()
  }

  if (open !== "Open Project") return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Open Project</h2>
        {keys.length === 0 ? (
          <p className="text-gray-500">No saved projects.</p>
        ) : (
          <ul className="space-y-2 overflow-y-auto max-h-62">
            {keys.map((key) => {
              const displayName = key.replace("flatland-project-", "")
              const isSelected = selectedKey === key
              return (
                <li key={key}>
                  <button
                    onClick={() => setSelectedKey(key)}
                    className={`w-full text-left px-4 py-2 rounded border ${
                      isSelected
                        ? "bg-blue-100 border-blue-400"
                        : "bg-stone-100 border-transparent hover:bg-stone-200"
                    }`}
                  >
                    {displayName}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button
            className="text-sm text-blue-500 hover:underline"
            onClick={hideModal}
          >
            Cancel
          </button>

          {selectedKey && (
            <button
              className="text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
              onClick={loadProject}
            >
              Load
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
