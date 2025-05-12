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
    <div className="flex flex-col">
      <label htmlFor="">Title</label>
      <h4>{proj.info.title}</h4>
      <label htmlFor="">Version</label>
      <h4>{proj.version}</h4>
      <label htmlFor="">Last Updated</label>
      <h4>{proj.info.lastUpdated}</h4>
      <label htmlFor="">Author</label>
      <h4>{proj.info.author}</h4>
      <button onClick={() => openProject(proj.info.title)}>Open Project</button>
      <div>
        <canvas>

        </canvas>
      </div>
    </div>
  )
}