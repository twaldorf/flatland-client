import React, { useEffect, useRef } from "react";
// import "./styles.css";
import { initScene, initCanvas } from "./main";
import { Toolbar } from "./UI/tools/Toolbar";
import { Header } from "./UI/sections/Header";
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
    <main className="app-container font-mono w-full h-screen overflow-hidden flex flex-col bg-stone-100">
      <Header></Header>
      <Toolbar></Toolbar>
      <div className="grid grid-cols-2">
  			<div className="h-svh">
          <h3>TabTitle</h3>
  				<canvas ref={canvasRef} id="canvas2d" className="w-full h-full col-1 block rounded-xl"></canvas>
  			</div>
  			<div id="main" className="h-svh">
  				<canvas ref={threeRef} id="canvas3d-container" className="w-1/1 h-100 col-2 block"></canvas>
  			</div>
		  </div>
    </main>
  );
};

export default App;
