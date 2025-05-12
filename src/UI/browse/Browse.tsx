import { Fragment } from "react/jsx-runtime";
import { PieceLibrary } from "../sections/PieceLibrary";
import { useAppState } from "../store";
import { ProjectInfo } from "../../types";
import { useState } from "react";
import { ProjectSummary } from "./ProjectSummary";

const Browser: React.FC = () => {
  const currentId = useAppState((s) => s.activeProjectTitle);
  const setCurrent = useAppState((s) => s.setActiveProjectTitle);

  const [ selectedProject, setSelectedProject ] = useState(undefined);

  const projectString = localStorage.getItem('flatland-projects');
  let projects = undefined;
    if (projectString) {
      projects = JSON.parse(projectString);
    } else {
      return;
    }
    if (projects.length <= 0) {
      return (
        <div>
          No projects found.
        </div>
      )
    }

  function getProjectDetails(name:string):ProjectSummary {
    const projectString = localStorage.getItem(name);
    if (projectString) {
      const project = JSON.parse(projectString);
      return { version: project.version, info: project.projectInfo, pieces: [], thumbnail: undefined };
    } else {
      throw new Error('Couldn\'t load project details.');
    }
    // return project;
  }

  return (
    // <Fragment>
    <div className="h-[88vh] flex flex-row border-t">
      <section className="w-1/4 border-r p-4 overflow-scroll h-1/1">
        <h2 className="text-lg font-semibold mb-4 text-black">Projects</h2>
        <ul className="">
          {typeof projects == 'object' && projects.map((projectName:string) => {
            const proj = getProjectDetails(projectName);
            return (
            <li
              key={proj.title}
              onClick={() => setSelectedProject(proj)}
              className={`p-2 rounded cursor-pointer mb-1 flex justify-between ${
                selectedProject && proj.info.title === selectedProject.info.title ? 'bg-stone-200' : 'hover:bg-stone-100'
              }`}
            >
              <p>{projectName.replace('flatland-project-', '')}</p>
              <p>{new Date(proj.info.lastUpdated).toLocaleDateString('us-en')}</p>
            </li>
          )})}
        </ul>
      </section>

      <section className="w-3/4 p-4 h-1/1">
        <h2 className="text-lg font-semibold mb-4">Details</h2>
        { selectedProject && 
          <ProjectSummary proj={selectedProject} />
        }
      </section>
    </div>
    // </Fragment>
  );
};

export default Browser;