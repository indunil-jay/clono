import { Hono } from "hono";

import { sessionMiddleware } from "@/src/tools/lib/appwrite/session-middleware";
import { getAllMembersInWorkspaceController } from "@/src/interface-adapter/controllers/members/get-all-members-in-workspace.controller";
import { deleteMemberInWorkspaceController } from "@/src/interface-adapter/controllers/members/delete-member-in-workspace.controller";
import { updateWorkspaceMemberRoleController } from "@/src/interface-adapter/controllers/members/update-member-role-in-workspace.controller";

const app = new Hono()
  .get("/:workspaceId", sessionMiddleware, async (ctx) => {
    const { workspaceId } = ctx.req.param();

    try {
      const members = await getAllMembersInWorkspaceController(workspaceId);
      return ctx.json({ status: "success", data: members }, 200);
    } catch (error) {
      return ctx.json({ status: "fail" }, 400);
    }
  })

  .delete(
    "/:memberId/workspaces/:workspaceId",
    sessionMiddleware,
    async (ctx) => {
      const { memberId, workspaceId } = ctx.req.param();
      try {
        await deleteMemberInWorkspaceController(memberId, workspaceId);
        return ctx.json({ status: "success" }, 200);
      } catch (error) {
        return ctx.json({ status: "fail" }, 400);
      }
    }
  )
  .patch(
    "/:memberId/workspaces/:workspaceId",
    sessionMiddleware,
    async (ctx) => {
      const { memberId, workspaceId } = ctx.req.param();

      try {
        const updatedData = await updateWorkspaceMemberRoleController({
          memberId,
          workspaceId,
        });
        return ctx.json({ message: "success", data: updatedData }, 200);
      } catch (error) {
        const err = error as Error;
        return ctx.json({ message: err.message, data: null }, 400);
      }
    }
  );

export default app;
