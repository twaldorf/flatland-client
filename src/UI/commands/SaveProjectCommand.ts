import { Command } from "../../Command"
import { state } from "../../State"

export class SaveProjectCommand implements Command {
  private readonly key: string;

  constructor(projectName?:string) {
    projectName = projectName ? projectName : state.projectInfo.title;
    this.key = `flatland-project-${projectName}`;
  }

  do() {
    const json = state.serialize();
    localStorage.setItem(this.key, json);
    const projects = localStorage.getItem('flatland-projects');
    if (projects) {
      const projects_list = JSON.parse(projects) as string[];
      if (!projects_list.some((name:string) => name === this.key)) {
        projects_list.push(this.key);
        localStorage.setItem('flatland-projects', JSON.stringify(projects_list));
      }
    } else {
      localStorage.setItem('flatland-projects', JSON.stringify([this.key]));
    }
    console.log('saved item to ', this.key);
  }

  undo() {
    // No undo for save, baby
  }
}
