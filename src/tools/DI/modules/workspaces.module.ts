import { IWorkspacesRepository } from "@/src/application/repositories/workspaces.repository.interface";
import { WorkspacesRepository } from "@/src/infastructure/repositories/workspaces.repository";
import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IWorkspacesRepository>(DI_SYMBOLS.IWorkspacesRepository).to(
    WorkspacesRepository
  );
};

export const WorkspacesModule = new ContainerModule(initializeModule);
