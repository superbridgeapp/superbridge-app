import { TokenModal } from "../tokens";
import { CustomTokenImportModal } from "../tokens/custom-token-import-modal";
import { ExpensiveGasModal } from "./alerts/expensive-gas-modal";
import { FaultProofsModal } from "./alerts/fault-proofs-modal";
import { NoGasModal } from "./alerts/no-gas-modal";
import { ConfirmationModalV2 } from "./confirmation-modal-v2";
import { FaultProofInfoModal } from "./fault-proofs/fault-proof-info-modal";
import { FeeBreakdownModal } from "./fee-breakdown-modal";
import { NetworkSelectorModal } from "./network-selector-modal";
import { RecipientAddressModal } from "./recipient-address-modal";
import { RouteSelectorModal } from "./route-selector-modal";
import { TransferTimeInfoModal } from "./transfer-time-info-modal";
import { WithdrawSettingsModal } from "./withdraw-settings-modal";
import { WithdrawalReadyToFinalizeModal } from "./withdrawal-ready-to-finalize-modal";

export const Modals = () => {
  return (
    <>
      <TransferTimeInfoModal />
      <FeeBreakdownModal />
      <NetworkSelectorModal />
      <RecipientAddressModal />
      <WithdrawSettingsModal />
      <RouteSelectorModal />
      <FaultProofInfoModal />
      <WithdrawalReadyToFinalizeModal />
      <CustomTokenImportModal />
      <TokenModal />
      <ConfirmationModalV2 />

      {/* Alerts */}
      <NoGasModal />
      <ExpensiveGasModal />
      <FaultProofsModal />
    </>
  );
};
