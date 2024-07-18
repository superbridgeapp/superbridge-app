import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";

export const useCancelBridge = () => {
  const setDisplayConfirmationModal =
    useConfigState.useSetDisplayConfirmationModal();
  const setPendingBridgeTransactionHash =
    useModalsState.useSetPendingBridgeTransactionHash();
  const setAlerts = useModalsState.useSetAlerts();

  return () => {
    setAlerts([]);
    setDisplayConfirmationModal(false);
    setPendingBridgeTransactionHash(null);
  };
};
