import { useContext } from "react"
import { pushCommand } from "../../Command"
import { NewProjectCommand } from "../commands/NewProjectCommand"
import { SaveProjectCommand } from "../commands/SaveProjectCommand"
import MenuItem from "./Header/MenuItem"
import { UserIcon } from "./Header/UserIcon"

interface Props {
  setOpen(v:boolean): void;
}

export const Header = ( props:Props ) => {

  const { setOpen } = props;

  function triggerOpen() {
    setOpen(true);
  }

  return (
    <header className="p-3 flex flex-row items-center justify-between">
      <section className="items-center flex-row flex ">
        <h1 className="text-2xl bg-stone-900 text-white inline-block px-2">Flatland Studio</h1>
        <MenuItem label={"File"} options={[
            { name: "Recent >", action: () => console.log("Zoom In") },
            { name: "New", action: () => pushCommand(new NewProjectCommand()) },
            { name: "Open", action: () => triggerOpen() },
            { name: "Save", action: () => pushCommand(new SaveProjectCommand()) },
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
