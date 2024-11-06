import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateProjectModal = () => {
  const [isOpen, setOpen] = useQueryState(
    "create-project",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return { isOpen, open, close, setOpen };
};
