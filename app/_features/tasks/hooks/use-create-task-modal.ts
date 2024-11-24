import { parseAsBoolean, useQueryState } from "nuqs";

export const useCreateTaskModal = () => {
  const [isOpen, setOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return { isOpen, open, close, setOpen };
};
