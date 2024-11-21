import { ContainerModule, interfaces } from "inversify";
import { DI_SYMBOLS } from "../types";
import { IMembersRepository } from "@/src/application/repositories/members.repository.interface";
import { MembersRepository } from "@/src/infastructure/repositories/members.repository";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IMembersRepository>(DI_SYMBOLS.IMembersRepository).to(MembersRepository);
};

export const MembersModule = new ContainerModule(initializeModule);
