import { ContainerModule, interfaces } from "inversify";

import { DI_SYMBOLS } from "../types";
import { IStorageService } from "@/src/application/services/storage-service.interface";
import { StorageService } from "@/src/infastructure/services/storage.service";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IStorageService>(DI_SYMBOLS.IStorageService).to(StorageService);
};

export const StorageModule = new ContainerModule(initializeModule);
