import React, { useEffect, useRef, useState } from "react";
// import "./styles.css";
import { initScene, initCanvas, initUpdate } from "./main";
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
import { SaveAsProjectModal } from "./UI/sections/Header/SaveAsProjectModal";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initCanvas(canvasRef.current);
    }
    if (threeRef.current) {
      initScene(threeRef.current);
    }
    pushCommand(new NewProjectCommand({title: 'untitled', author: 'unknown'}));
    initUpdate();
  }, []);

  return (
    <main className="app-container font-mono w-full h-screen overflow-hidden flex flex-col bg-stone-100 pb-2">
  <div>
    <OpenProjectOverlay />
    <NewProjectModal />
    <EditProjectModal />
    <SaveAsProjectModal />
    <Header />
    <Tabs />
  </div>


  <div className="grid grid-cols-4 flex-1 overflow-hidden">
    {/* Left column */}
    <section className="relative flex flex-col bg-white p-3 overflow-hidden col-span-3">
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
      {/* <canvas
        ref={threeRef}
        id="canvas3d-container"
        className="flex-1 w-full h-full"
      ></canvas> */}
    </section>
  </div>
</main>

  );
};

export default App;
