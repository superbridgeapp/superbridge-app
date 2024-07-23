import { FaultProofInfoModal } from "../fault-proof-info-modal";
import { TokenModal } from "../tokens";
import { CustomTokenImportModal } from "../tokens/custom-token-import-modal";
import { WithdrawalReadyToFinalizeModal } from "../withdrawal-ready-to-finalize-modal";
import { FeeBreakdownModal } from "./fee-breakdown-modal";
import { NetworkSelectorModal } from "./network-selector-modal";
import { RecipientAddressModal } from "./recipient-address-modal";
import { RouteSelectorModal } from "./route-selector-modal";
import { TransferTimeInfoModal } from "./transfer-time-info-modal";
import { WithdrawSettingsModal } from "./withdraw-settings-modal";

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
    </>
  );
};
