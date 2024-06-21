import { FeeBreakdownModal } from "./fee-breakdown-modal";
import { NetworkSelectorModal } from "./network-selector-modal";
import { RecipientAddressModal } from "./recipient-address-modal";
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
    </>
  );
};
