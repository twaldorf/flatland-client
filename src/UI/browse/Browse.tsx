import { Fragment } from "react/jsx-runtime";
import { PieceLibrary } from "../sections/PieceLibrary";
import { useAppState } from "../store";

const Browser: React.FC = () => {
  const currentId = useAppState((s) => s.activeProjectTitle);
  const setCurrent = useAppState((s) => s.setActiveProjectTitle);

  let projects = localStorage.getItem('flatland-projects');
    if (projects) {
      projects = JSON.parse(projects);
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

  function getProjectDetails(name:string) {
    const project = localStorage.getItem(name);
    return project;
  }

  return (
    <Fragment>
    {/* <div className="flex flex-1"> */}
      <section className="w-1/4 border-r p-4 overflow-scroll">
        <h2 className="text-lg font-semibold mb-4 text-black">Projects</h2>
        <ul className="overflow-scroll">
          {projects && projects.map((projectName:string) => {
            const proj = getProjectDetails(projectName);
            return (
            <li
              key={proj.title}
              onClick={() => setCurrent(proj.id)}
              className={`p-2 rounded cursor-pointer mb-1 ${
                proj.id === currentId ? 'bg-stone-200' : 'hover:bg-stone-100'
              }`}
            >
              {projectName.replace('flatland-project-', '')}
            </li>
          )})}
        </ul>
      </section>

      <section className="flex-1 p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Pieces</h2>
        <PieceLibrary />
      </section>
    {/* </div> */}
    </Fragment>
  );
};

export default Browser;