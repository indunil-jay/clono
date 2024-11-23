import { Container } from "inversify";

import { DI_RETURN_TYPES, DI_SYMBOLS } from "@/DI/types";

import { AuthenticationModule } from "@/DI/modules/authentication.module";
import { StorageModule } from "@/DI/modules/storage.module";
import { WorkspacesModule } from "@/DI/modules/workspaces.module";
import { MembersModule } from "@/DI/modules/members.module";
import { TasksModule } from "@/DI/modules/tasks.module";
import { ProjectsModule } from "@/DI/modules/projects.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(AuthenticationModule);
  ApplicationContainer.load(StorageModule);
  ApplicationContainer.load(WorkspacesModule);
  ApplicationContainer.load(MembersModule);
  ApplicationContainer.load(TasksModule);
  ApplicationContainer.load(ProjectsModule);
};

export const destroyContainer = () => {
  ApplicationContainer.unload(AuthenticationModule);
  ApplicationContainer.unload(StorageModule);
  ApplicationContainer.unload(WorkspacesModule);
  ApplicationContainer.unload(MembersModule);
  ApplicationContainer.unload(TasksModule);
  ApplicationContainer.unload(ProjectsModule);
};

if (process.env.NODE_ENV !== "test") {
  initializeContainer();
}

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}

export { ApplicationContainer };
