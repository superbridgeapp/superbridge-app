import { ModalName, useModalsState } from "@/state/modals";

export const useModal = (name: ModalName) => {
  const addModal = useModalsState.useAddModal();
  const removeModal = useModalsState.useRemoveModal();
  const modals = useModalsState.useModals();
  const setActiveId = useModalsState.useSetActiveId();
  const activeId = useModalsState.useActiveId();

  return {
    isOpen: !!modals[name],
    data: activeId,
    open: (data?: string) => {
      if (data) setActiveId(data);
      addModal(name);
    },
    close: () => {
      setActiveId(null);
      removeModal(name);
    },
  };
};
