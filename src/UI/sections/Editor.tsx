import { Ref, RefObject } from "react";
import { Pieces } from "../inventory/Pieces";
import { Toolbar } from "../tools/Toolbar";
import { Header } from "./Header";
import { EditProjectModal } from "./Header/EditProjectModal";
import { NewProjectModal } from "./Header/NewProjectModal";
import { OpenProjectOverlay } from "./Header/OpenOverlay";
import { SaveAsProjectModal } from "./Header/SaveAsProjectModal";
import CursorInfo from "./Overlay/CursorInfo";
import Label from "./Overlay/Label";
import { ShapeInfo } from "./Overlay/ShapeInfo";
import { Tabs } from "./Workspace/Tabs";

export const Editor = ({ canvasRef, threeRef }) => {
  return (
      <div className="grid grid-cols-4 flex-1 overflow-hidden">
        {/* Left column */}
        <section className="wrelative flex flex-col bg-white p-3 overflow-hidden col-span-3">
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
  );
};
