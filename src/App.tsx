import React, { useEffect, useRef } from "react";
// import "./styles.css";
import { initScene, initCanvas } from "./main";
import { Toolbar } from "./UI/tools/Toolbar";
// import { initThreeScene } from "./threeSetup"; // Assuming you have a Three.js scene setup

const canvasStyle = {
  width: "50%"
}

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
    <div className="app-container container font-mono">
      <h1>Design Pattern Systems</h1>
  		<div>
        <Toolbar></Toolbar>
  			<div>
  				<h3>Flat pattern</h3>
  				<canvas ref={canvasRef} id="canvas2d" style={canvasStyle}></canvas>
  			</div>
  			<div id="main">
  				<h3>Volume editor</h3>
  				<canvas ref={threeRef} id="canvas3d-container" style={canvasStyle}></canvas>
  			</div>
  		</div>
      <div className="ui-panel">
        <button onClick={() => alert("Clicked!")}>Click Me</button>
      </div>
    </div>
  );
};

export default App;
