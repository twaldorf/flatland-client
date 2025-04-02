import React, { useEffect, useRef } from "react";
// import "./styles.css";
import { initScene, initCanvas } from "./main";
import { Toolbar } from "./UI/tools/Toolbar";
import { Header } from "./UI/sections/Header";
import { Tabs } from "./UI/sections/Workspace/Tabs";
import { Pieces } from "./UI/inventory/Pieces";
import Label from "./UI/sections/Overlay/Label";
import CursorInfo from "./UI/sections/Overlay/CursorInfo";
import { ShapeInfo } from "./UI/sections/Overlay/ShapeInfo";
// import { initThreeScene } from "./threeSetup"; // Assuming you have a Three.js scene setup

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && threeRef.current) {
      initScene(threeRef.current);
      initCanvas(canvasRef.current);
    }
  }, []);

  return (
    <main className="app-container font-mono w-full h-screen overflow-hidden flex flex-col bg-stone-100 pb-2">
  <div>
    <Header />
    <Tabs
      activeTab={"untitled"}
      tabs={["untitled"]}
      onTabChange={(tab: string) => {
        throw new Error("Function not implemented.");
      }}
    />
  </div>

  <Label />

  <div className="grid grid-cols-2 flex-1 overflow-hidden">
    {/* Left Column: 2D Canvas */}
    <section className="relative flex flex-col bg-white p-3 overflow-hidden">
      <Toolbar />
      <CursorInfo />
      <ShapeInfo />
      <canvas
        ref={canvasRef}
        id="canvas2d"
        className="flex-1 w-full h-full rounded-md"
      ></canvas>
    </section>

    {/* Right Column: 3D Canvas and Pieces */}
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
