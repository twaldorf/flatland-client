import MenuItem from "./Header/MenuItem"
import { UserIcon } from "./Header/UserIcon"

export const Header = () => {
  return (
    <header className="p-3 flex flex-row items-center justify-between">
      <section className="items-center flex-row flex ">
        <h1 className="text-2xl bg-stone-900 text-white inline-block px-2">Flatland Studio</h1>
        <MenuItem label={"File"} options={[
            { name: "Recent >", action: () => console.log("Zoom In") },
            { name: "New", action: () => console.log("Zoom Out") },
            { name: "Open", action: () => console.log("Zoom Out") },
            { name: "Save", action: () => console.log("Zoom Out") },
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
