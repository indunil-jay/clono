import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateWorkspaceModal = () => {
  const [isOpen, setOpen] = useQueryState(
    "create-workspace",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return { isOpen, open, close, setOpen };
};
