import { useContext } from "react"
import { pushCommand } from "../../Command"
import { NewProjectCommand } from "../commands/NewProjectCommand"
import { SaveProjectCommand } from "../commands/SaveProjectCommand"
import MenuItem from "./Header/MenuItem"
import { UserIcon } from "./Header/UserIcon"
import { useAppState } from "../AppState"

export const Header = () => {

  const showModal = useAppState(s => s.showModal);

  return (
    <header className="p-3 flex flex-row items-center justify-between">
      <section className="items-center flex-row flex ">
        <h1 className="text-2xl bg-stone-900 text-white inline-block px-2">Flatland Studio</h1>
        <MenuItem label={"File"} options={[

            { name: "Recent >", action: () => console.log("Zoom In") },

            { name: "New", action: () => showModal('New Project') },

            { name: "Open", action: () => showModal('Open Project')},

            { name: "Save", action: () => {
              const activeTitle = useAppState.getState().activeProjectTitle;

              // If the project has no title, prompt Save As modal
              if (!activeTitle || activeTitle == "untitled") {
                useAppState.getState().showModal("Save As Project");
              } else {
                pushCommand(new SaveProjectCommand());
              }
            } },

          ]} />
      </section>
      <section>
        <UserIcon user={null} onLogin={function (): void {
        throw new Error("Function not implemented.")
      } } onLogout={function (): void {
        throw new Error("Function not implemented.")
      } }></UserIcon>
      </section>
    </header>
  )
}
