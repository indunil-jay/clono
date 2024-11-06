//defined all the method, invooke with worspace repositorites

import { Context } from "hono";

export interface IWorkspacesRepository {
  getAll(ctx: Context): Promise<any>;
}
