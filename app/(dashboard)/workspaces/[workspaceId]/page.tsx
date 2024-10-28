export default async function Page({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { workspaceId } = await params;
  return <div>workspace id - {workspaceId}</div>;
}
