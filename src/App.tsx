import React, { useEffect, useRef, useState } from "react";
// import "./styles.css";
import { initScene, initCanvas } from "./main";
import { Toolbar } from "./UI/tools/Toolbar";
import { Header } from "./UI/sections/Header";
import { Tabs } from "./UI/sections/Workspace/Tabs";
import { Pieces } from "./UI/inventory/Pieces";
import Label from "./UI/sections/Overlay/Label";
import CursorInfo from "./UI/sections/Overlay/CursorInfo";
import { ShapeInfo } from "./UI/sections/Overlay/ShapeInfo";
import { OpenProjectOverlay } from "./UI/sections/Header/OpenOverlay";
import { useAppState } from "./UI/store";
import { NewProjectModal } from "./UI/sections/Header/NewProjectModal";
import { pushCommand } from "./Command";
import { NewProjectCommand } from "./UI/commands/NewProjectCommand";
import { EditProjectModal } from "./UI/sections/Header/EditProjectModal";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && threeRef.current) {
      initScene(threeRef.current);
      initCanvas(canvasRef.current);
      pushCommand(new NewProjectCommand({title: 'untitled', author: 'unknown'}));
    }
  }, []);

  // TODO: Change this from hook to use Zustand modal context
  const [ open, setOpen ] = useState(false);

  const activeProjectTitle = useAppState(state => state.activeProjectTitle);
  const openProjects = useAppState(state => state.openProjectTitles);

  return (
    <main className="app-container font-mono w-full h-screen overflow-hidden flex flex-col bg-stone-100 pb-2">
  <div>
    <OpenProjectOverlay />
    <NewProjectModal />
    <EditProjectModal />
    <Header />
    <Tabs />
  </div>


  <div className="grid grid-cols-2 flex-1 overflow-hidden">
    {/* Left column */}
    <section className="relative flex flex-col bg-white p-3 overflow-hidden">
      <Toolbar />
      <CursorInfo />
      <ShapeInfo />
      <Label />
      <canvas
        ref={canvasRef}
        id="canvas2d"
        className="flex-1 w-full h-full rounded-md"
      ></canvas>
    </section>

    {/* Right column */}
    <section className="flex flex-col h-full overflow-hidden">
      <Pieces />
      <canvas
        ref={threeRef}
        id="canvas3d-container"
        className="flex-1 w-full h-full"
      ></canvas>
    </section>
  </div>
</main>

  );
};

export default App;
