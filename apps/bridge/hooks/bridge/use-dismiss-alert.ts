import { AlertModals } from "@/constants/modal-names";
import { useModalsState } from "@/state/modals";

export const useDismissAlert = (initiateBridge: () => void) => {
  const alerts = useModalsState.useAlerts();
  const setAlerts = useModalsState.useSetAlerts();

  return (id: AlertModals) => {
    setAlerts(alerts.filter((a) => a !== id));
    if (alerts.length === 1) {
      initiateBridge();
    }
  };
};
