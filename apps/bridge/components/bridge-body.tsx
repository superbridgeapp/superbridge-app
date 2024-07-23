import { AlertModals } from "@/constants/modal-names";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useCancelBridge } from "@/hooks/bridge/use-cancel-bridge";
import { useDismissAlert } from "@/hooks/bridge/use-dismiss-alert";
import { useInitiateBridge } from "@/hooks/bridge/use-initiate-bridge";
import { useAllowance } from "@/hooks/use-allowance";
import { useApprove } from "@/hooks/use-approve";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useModalsState } from "@/state/modals";

import { FromTo } from "./FromTo";
import { ExpensiveGasModal } from "./alerts/expensive-gas-modal";
import { FaultProofsModal } from "./alerts/fault-proofs-modal";
import { NoGasModal } from "./alerts/no-gas-modal";
import { BridgeButton } from "./bridge-button";
import { ConfirmationModalV2 } from "./confirmation-modal-v2";
import { LineItems } from "./line-items";
import { Modals } from "./modals";
import { TokenInput } from "./token-input";

export const BridgeBody = () => {
  const bridge = useBridge();
  const weiAmount = useWeiAmount();
  const token = useSelectedToken();

  const alerts = useModalsState.useAlerts();

  const initiateBridge = useInitiateBridge(bridge);

  const allowance = useAllowance(token, bridge.address);

  const approve = useApprove(
    token,
    bridge.address,
    allowance.refetch,
    bridge.refetch,
    weiAmount
  );

  const onDismissAlert = useDismissAlert(initiateBridge);
  const onCancel = useCancelBridge();

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <ConfirmationModalV2
        approve={approve}
        allowance={allowance}
        bridge={bridge}
        initiateBridge={initiateBridge}
      />

      <Modals />

      {/* alerts */}
      <NoGasModal
        open={alerts.includes(AlertModals.NoGas)}
        onCancel={onCancel}
        onProceed={() => onDismissAlert(AlertModals.NoGas)}
      />
      <ExpensiveGasModal
        open={alerts.includes(AlertModals.GasExpensive)}
        onCancel={onCancel}
        onProceed={() => onDismissAlert(AlertModals.GasExpensive)}
      />
      <FaultProofsModal
        open={alerts.includes(AlertModals.FaultProofs)}
        onCancel={onCancel}
        onProceed={() => onDismissAlert(AlertModals.FaultProofs)}
      />

      <div className="flex flex-col gap-1">
        <FromTo />

        <TokenInput />
      </div>

      <LineItems />

      <BridgeButton />
    </div>
  );
};
