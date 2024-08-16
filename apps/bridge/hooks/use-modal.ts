import { ModalNames } from "@/constants/modal-names";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";

export const useModal = (name: ModalNames) => {
  const addModal = useConfigState.useAddModal();
  const removeModal = useConfigState.useRemoveModal();
  const modals = useConfigState.useModals();
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
