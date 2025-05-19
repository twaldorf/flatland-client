import { useState } from "react"
import { pushCommand } from "../../../Command"
import { NewProjectCommand } from "../../commands/NewProjectCommand"
import { state } from "../../../State"
import { useAppState } from "../../AppState"

export const EditProjectModal = () => {
  const modal = useAppState((s) => s.modal)
  const hideModal = useAppState((s) => s.hideModal)
  const setActiveProjectTitle = useAppState((s) => s.setActiveProjectTitle)

  const title = useAppState(s => s.activeProjectTitle);
  const setTitle = useAppState(s => s.setActiveProjectTitle);
  // const [author, setAuthor] = useState("")
  // const [type, setType] = useState("Garment")

  if (modal !== "Edit Project Info") return null

  const handleSubmit = () => {

    const projectInfo = {
      title,
      author: "",
      lastUpdated: new Date()
    }

    setActiveProjectTitle(title);
    state.projectInfo = projectInfo;
    hideModal()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Project Info</h2>

        <label className="block mb-2">
          <span className="block text-sm font-medium">Project Title</span>
          <input
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="block mb-2">
          <span className="block text-sm font-medium">Author</span>
          {/* <input
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          /> */}
        </label>

        {/* <label className="block mb-2">
          <span className="block text-sm font-medium">Type</span>
          <select
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Garment">Garment</option>
            <option value="Gear">Gear</option>
            <option value="Custom">Custom</option>
          </select>
        </label> */}

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            onClick={hideModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
