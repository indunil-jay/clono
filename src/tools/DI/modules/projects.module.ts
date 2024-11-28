import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { ProjectRepository } from "@/src/infastructure/repositories/projects.repository";
import { IProjectRepository } from "@/src/application/repositories/projects.repository.interface";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IProjectRepository>(DI_SYMBOLS.IProjectRepository).to(ProjectRepository);
};

export const ProjectsModule = new ContainerModule(initializeModule);
