import { Container } from "inversify";

import { DI_RETURN_TYPES, DI_SYMBOLS } from "./types";

import { AuthenticationModule } from "./modules/authentication.module";
import { StorageModule } from "./modules/storage.module";
import { WorkspacesModule } from "./modules/workspaces.module";
import { MembersModule } from "./modules/members.module";
import { TasksModule } from "./modules/tasks.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(AuthenticationModule);
  ApplicationContainer.load(StorageModule);
  ApplicationContainer.load(WorkspacesModule);
  ApplicationContainer.load(MembersModule);
  ApplicationContainer.load(TasksModule);
};

export const destroyContainer = () => {
  ApplicationContainer.unload(AuthenticationModule);
  ApplicationContainer.unload(StorageModule);
  ApplicationContainer.unload(WorkspacesModule);
  ApplicationContainer.unload(MembersModule);
  ApplicationContainer.unload(TasksModule);
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
