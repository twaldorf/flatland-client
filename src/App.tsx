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
import { NewProjectModal } from "./UI/sections/Header/NewProjectModal";
import { pushCommand } from "./Command";
import { NewProjectCommand } from "./UI/commands/NewProjectCommand";
import { EditProjectModal } from "./UI/sections/Header/EditProjectModal";
import { SaveAsProjectModal } from "./UI/sections/Header/SaveAsProjectModal";
import { useViewState, ViewName } from "./UI/ViewState";
import { useViewRouting } from "./routes";
import { Editor } from "./UI/sections/Editor";
import { PieceLibrary } from "./UI/sections/PieceLibrary";
import Browser from "./UI/browse/Browse";
import Mark from "./UI/mark/Mark";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeRef = useRef<HTMLCanvasElement>(null);
  const view = useViewState((vs) => vs.view);

  useViewRouting();

  // Set up canvas refs and create new project
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

  const ViewComponentMap: Record<ViewName, React.ReactNode> = {
    "app": <Editor canvasRef={canvasRef} threeRef={threeRef} />,
    "piece library": <PieceLibrary />,
    "mark": <Mark />,
    "browser": <Browser />,
  };

  return (
    <main className="app-container font-mono w-full h-screen overflow-hidden bg-stone-100 pb-2">
      <div className="flex flex-col h-12vh">
        <OpenProjectOverlay />
        <NewProjectModal />
        <EditProjectModal />
        <SaveAsProjectModal />
        <Header />
        <Tabs />
      </div>
      {ViewComponentMap[view] ?? (
        <Editor canvasRef={canvasRef} threeRef={threeRef} />
      )}
    </main>
  )
};

export default App;
