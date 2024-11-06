import { IWorkspacesRepository } from "@/src/application/repositories/workspaces.repository.interface";
import { IAuthenticationService } from "@/src/application/services/authentication-service.interface";

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),

  // Repositories
  IWorkspacesRepository: Symbol.for("IWorkspacesRepository"),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;

  // Repositories
  IWorkspacesRepository: IWorkspacesRepository;
}
