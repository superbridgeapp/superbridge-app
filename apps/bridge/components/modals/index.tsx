import { LegalModal } from "../legal-modal";
import { SettingsModal } from "../settings/settings-modal";
import { TokenModal } from "../tokens";
import { CustomTokenImportModal } from "../tokens/custom-token-import-modal";
import { TosModal } from "../tos-modal";
import { ExpensiveGasModal } from "./alerts/expensive-gas-modal";
import { FaultProofsModal } from "./alerts/fault-proofs-modal";
import { NoGasModal } from "./alerts/no-gas-modal";
import { ConfirmationModalV2 } from "./confirmation-modal-v2";
import { BlockProvingModal } from "./fault-proofs/block-proving-modal";
import { FaultProofInfoModal } from "./fault-proofs/fault-proof-info-modal";
import { FeeBreakdownModal } from "./fee-breakdown-modal";
import { RecipientAddressModal } from "./recipient-address-modal";
import { RouteSelectorModal } from "./route-selector-modal";
import { TransactionDetailsModal } from "./transaction-details-modal";
import { TransferTimeInfoModal } from "./transfer-time-info-modal";
import { WithdrawalReadyToFinalizeModal } from "./withdrawal-ready-to-finalize-modal";

export const Modals = () => {
  return (
    <>
      <TransferTimeInfoModal />
      <FeeBreakdownModal />
      <RecipientAddressModal />
      <RouteSelectorModal />
      <FaultProofInfoModal />
      <WithdrawalReadyToFinalizeModal />
      <CustomTokenImportModal />
      <TokenModal />
      <ConfirmationModalV2 />
      <TransactionDetailsModal />

      {/* Alerts */}
      <NoGasModal />
      <ExpensiveGasModal />
      <FaultProofsModal />

      <TosModal />
      <LegalModal />
      <CustomTokenImportModal />
      <BlockProvingModal />

      <SettingsModal />
    </>
  );
};
