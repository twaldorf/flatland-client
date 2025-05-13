import { pushCommand } from "../../Command"
import { LoadProjectCommand } from "../commands/LoadProjectCommand"
import { useViewState } from "../ViewState";

export const ProjectSummary:React.FC = ({ proj }) => {

  const browse = useViewState.getState().setView;

  function openProject(projectTitle:string) {
    pushCommand(new LoadProjectCommand(projectTitle));
    browse('app');
  }

  return (
    <div className="flex flex-col gap-8 list-none">
      <li>
        <label htmlFor="">Title</label>
        <h4>{proj.info.title}</h4>
      </li>
      <li>
        <label htmlFor="">Made with version</label>
        <h4>{proj.version}</h4>
      </li>
      <li>
        <label htmlFor="">Last Updated</label>
        <h4>{proj.info.lastUpdated}</h4>
      </li>
      <li>
        <label htmlFor="">Author</label>
        <h4>{proj.info.author}</h4>
      </li>

      <button onClick={() => openProject(proj.info.title)}>Open Project</button>

      <div>
        <canvas>

        </canvas>
      </div>
    </div>
  )
}
