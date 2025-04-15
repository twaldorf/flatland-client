import { useState } from "react"
import { useAppState } from "../../store"

export const NewProjectModal = () => {
  const modal = useAppState((s) => s.modal)
  const hideModal = useAppState((s) => s.hideModal)
  const setActiveProjectTitle = useAppState((s) => s.setActiveProjectTitle)
  // const categories = useAppState((s) => s.categories)
  // const addCategory = useAppState((s) => s.addCategory)

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [type, setType] = useState("Garment")
  // const [category, setCategory] = useState(categories[0] || "")
  // const [newCategory, setNewCategory] = useState("")

  if (modal !== "New Project") return null

  const handleSubmit = () => {
    // if (newCategory && !categories.includes(newCategory)) {
    //   addCategory(newCategory)
    //   setCategory(newCategory)
    // }

    setActiveProjectTitle(title || "Untitled")
    // TODO: set other project metadata if needed
    hideModal()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">New Project</h2>

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
          <input
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>

        <label className="block mb-2">
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
        </label>

        {/* <label className="block mb-2">
          <span className="block text-sm font-medium">Category</span>
          <select
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label> */}

        {/* <label className="block mb-4">
          <span className="block text-sm font-medium">Or add new category</span>
          <input
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
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
            Create Project
          </button>
        </div>
      </div>
    </div>
  )
}
