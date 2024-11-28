import { ITasksRepository } from "@/src/application/repositories/tasks.repository.interface";
import { TasksRepository } from "@/src/infastructure/repositories/tasks.repository";
import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";

const initializeModule = (bind: interfaces.Bind) => {
  bind<ITasksRepository>(DI_SYMBOLS.ITasksRepository).to(TasksRepository);
};

export const TasksModule = new ContainerModule(initializeModule);
