import { FeeBreakdownModal } from "./fee-breakdown-modal";
import { NetworkSelectorModal } from "./network-selector-modal";
import { TransferTimeInfoModal } from "./transfer-time-info-modal";

export const Modals = () => {
  return (
    <>
      <TransferTimeInfoModal />
      <FeeBreakdownModal />
      <NetworkSelectorModal />
    </>
  );
};
