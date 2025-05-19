import React, { useEffect, useRef } from "react";
// import "./styles.css";
import { Header } from "./UI/sections/Header";
import { Tabs } from "./UI/sections/Workspace/Tabs";
import { OpenProjectOverlay } from "./UI/sections/Header/OpenOverlay";
import { NewProjectModal } from "./UI/sections/Header/NewProjectModal";
import { pushCommand } from "./Command";
import { SaveAsProjectModal } from "./UI/sections/Header/SaveAsProjectModal";
import { useViewState, ViewName } from "./UI/ViewState";
import { useAppState } from './UI/AppState';
import { useViewRouting } from "./routes";
import { Editor } from "./UI/sections/Editor";
import { PieceLibrary } from "./UI/sections/PieceLibrary";
import Browser from "./UI/browse/Browse";
import Mark from "./UI/mark/Mark";
import { SaveProjectCommand } from "./UI/commands/SaveProjectCommand";
// import { state } from "./State";
import { LoadProjectCommand } from "./UI/commands/LoadProjectCommand";
import { BASE_PROJECT_TITLE } from "./constants";
import { EditProjectModal } from "./UI/sections/Header/EditProjectModal";
import { Workspaces } from "./UI/sections/Workspace/Workspaces";

const App: React.FC = () => {
  useEffect(() => {
    // autoSave();
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeRef = useRef<HTMLCanvasElement>(null);
  console.log('RENDER ROOT')

  // state.clear();
  // loadAutosave();

  function loadAutosave() {
    if (state.projectInfo.title == BASE_PROJECT_TITLE) {
      const projectString = localStorage.getItem('flatland-project-autosave');
      if (projectString) {
        const project = JSON.parse(projectString);
        if (project.version === state.version) {
          pushCommand(new LoadProjectCommand('flatland-project-autosave'));
        }
      }
    }
  }

  function autoSave() {
    const title = state.projectInfo.title;
    setInterval(() => {
      if (state.autosave) {
        pushCommand(new SaveProjectCommand(title));
      }
    }, 1000 * 5);
  }

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
      <Workspaces canvasRef={canvasRef} threeRef={threeRef} />
    </main>
  )
};

export default App;
