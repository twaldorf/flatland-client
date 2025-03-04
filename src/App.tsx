import React, { useEffect, useRef } from "react";
// import "./styles.css";
import { initScene, initCanvas } from "./main";
import { Toolbar } from "./UI/tools/Toolbar";
import { Header } from "./UI/sections/Header";
import { Tabs } from "./UI/sections/Workspace/Tabs";
import { Pieces } from "./UI/inventory/Pieces";
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
      <div className="max-h-1/3">
        <Header></Header>

        <Tabs activeTab={"untitled"} tabs={["untitled"]} onTabChange={function (tab: string): void {
          throw new Error("Function not implemented.");
        } }></Tabs>
      </div>

      <div className="grid grid-cols-2">

  			<section className="container py-2 bg-white m-0 px-3 h-2/3">

          <Toolbar></Toolbar>

  				<canvas ref={canvasRef} id="canvas2d" className="col-1 block rounded-md w-full h-full"></canvas>

  			</section>

  			<section id="main" className="h-svh">
          <Pieces></Pieces>
  				<canvas ref={threeRef} id="canvas3d-container" className="w-1/1 h-100 col-2 block"></canvas>

  			</section>

		  </div>

    </main>
  );
};

export default App;
