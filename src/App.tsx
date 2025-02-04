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
    <main className="app-container font-mono w-full h-full no-scroll">
      <Header></Header>
      <Toolbar></Toolbar>
      <div className="grid grid-cols-2">
  			<div className="h-svh">
  				<canvas ref={canvasRef} id="canvas2d" className="w-full h-full col-1"></canvas>
  			</div>
  			<div id="main" className="h-svh">
  				<canvas ref={threeRef} id="canvas3d-container" className="w-full h-full col-2"></canvas>
  			</div>
		  </div>
    </main>
  );
};

export default App;
