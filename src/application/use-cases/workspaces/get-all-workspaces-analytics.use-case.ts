import { createSessionClient } from "@/src/tools/lib/appwrite/appwrite";
import { getAllWorkspacesWithCurrentUserUseCase } from "./get-all-workspaces-by-user.use-case";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getInjection } from "@/src/tools/DI/container";
import { MemberRole } from "@/src/entities/member.enum";

export const getAllWorkspacesAnallticsUseCase = async () => {
  //get current session user
  const { account } = await createSessionClient();
  const user = await account.get();

  if (!user) {
    throw new Error("Please log in with your account");
  }

  //analytics time ranges
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const membersRepository = getInjection("IMembersRepository");
  const membersCollectionDocumentList = await membersRepository.getAllByUser(
    user.$id
  );
  const totalWorkspaces = membersCollectionDocumentList.total ?? 0;

  //get this month total workpaces created by user (admin).
  const adminWorkspacesList = membersCollectionDocumentList.documents.filter(
    (document) => document.role === MemberRole.ADMIN
  );

  const adminWorkspacesTotal = adminWorkspacesList.length ?? 0;

  // Calculate this month's and last month's workspaces totals
  const thisMonthAdminWorkspacesTotal =
    adminWorkspacesList.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return createdAt >= thisMonthStart && createdAt <= thisMonthEnd;
    }).length ?? 0;

  const lastMonthAdminWorkspacesTotal =
    adminWorkspacesList.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
    }).length ?? 0;

  //get this month total workpaces joined by user (member).
  const memberWorkspacesList = membersCollectionDocumentList.documents.filter(
    (document) => document.role === MemberRole.MEMBER
  );
  const memberWorkspacesTotal = memberWorkspacesList.length ?? 0;

  // Calculate this month's and last month's workspaces totals
  const thisMonthMemberWorkspacesTotal =
    memberWorkspacesList.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return createdAt >= thisMonthStart && createdAt <= thisMonthEnd;
    }).length ?? 0;

  const lastMonthMemberWorkspacesTotal =
    memberWorkspacesList.filter((document) => {
      const createdAt = new Date(document.$createdAt);
      return createdAt >= lastMonthStart && createdAt <= lastMonthEnd;
    }).length ?? 0;

  const workspaceAnalytics = {
    totalWorkspaces,
    adminWorkspacesTotal,
    thisMonthAdminWorkspacesTotal,
    lastMonthAdminWorkspacesTotal,
    memberWorkspacesTotal,
    thisMonthMemberWorkspacesTotal,
    lastMonthMemberWorkspacesTotal,
  };

  console.log(workspaceAnalytics);

  return workspaceAnalytics;
};
