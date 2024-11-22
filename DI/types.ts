import { IMembersRepository } from "@/src/application/repositories/members.repository.interface";
import { ITasksRepository } from "@/src/application/repositories/tasks.repository.interface";
import { IWorkspacesRepository } from "@/src/application/repositories/workspaces.repository.interface";
import { IAuthenticationService } from "@/src/application/services/authentication-service.interface";
import { IStorageService } from "@/src/application/services/storage-service.interface";

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),
  IStorageService: Symbol.for("IStorageService"),

  // Repositories
  IWorkspacesRepository: Symbol.for("IWorkspacesRepository"),
  IMembersRepository: Symbol.for("IMembersRepository"),
  ITasksRepository: Symbol.for("ITasksRepository"),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  IStorageService: IStorageService;

  // Repositories
  IWorkspacesRepository: IWorkspacesRepository;
  IMembersRepository: IMembersRepository;
  ITasksRepository: ITasksRepository;
}
