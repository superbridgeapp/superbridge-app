import { AlertModals } from "@/constants/modal-names";
import { useModalsState } from "@/state/modals";

import { useInitiateBridge } from "./use-initiate-bridge";

export const useDismissAlert = (id: AlertModals) => {
  const alerts = useModalsState.useAlerts();
  const setAlerts = useModalsState.useSetAlerts();
  const initiateBridge = useInitiateBridge();

  return () => {
    setAlerts(alerts.filter((a) => a !== id));
    if (alerts.length === 1) {
      initiateBridge();
    }
  };
};
