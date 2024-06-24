import { useTranslation } from "react-i18next";

import { useAcrossDomains } from "@/hooks/across/use-across-domains";
import { usePeriodText } from "@/hooks/use-period-text";
import { useFastTransferPeriod } from "@/hooks/use-transfer-time";
import { AcrossBridgeDto } from "@/types/across";

import { transactionLink } from "../transaction-link";
import { ExpandedItem, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useAcrossProgressRows = () => {
  const { t } = useTranslation();
  const transformPeriodText = usePeriodText();
  const transferPeriod = useFastTransferPeriod();

  const acrossDomains = useAcrossDomains();
  return (tx: AcrossBridgeDto): ExpandedItem[] => {
    const fromDomain = acrossDomains.find((x) => x.chain.id === tx.fromChainId);
    const toDomain = acrossDomains.find((x) => x.chain.id === tx.toChainId);

    const l2ConfirmationText = (() => {
      if (tx.fill) return "";
      if (!tx.deposit.timestamp) {
        return transformPeriodText("transferTime", {}, transferPeriod);
      }

      const remainingTimePeriod = getRemainingTimePeriod(
        tx.deposit.timestamp,
        transferPeriod
      );

      if (!remainingTimePeriod) return "";
      return transformPeriodText("activity.remaining", {}, remainingTimePeriod);
    })();

    // assume immediate confirmation for rollups
    const initiate =
      tx.deposit.timestamp || tx.fromChainId !== 1
        ? {
            label: t("activity.bridged"),
            status: ProgressRowStatus.Done,
            link: transactionLink(
              tx.deposit.transactionHash,
              fromDomain?.chain
            ),
          }
        : {
            label: t("activity.bridging"),
            status: ProgressRowStatus.InProgress,
            link: transactionLink(
              tx.deposit.transactionHash,
              fromDomain?.chain
            ),
          };

    return [
      initiate,
      tx.fill
        ? {
            label: "Filled",
            status: ProgressRowStatus.Done,
            link: transactionLink(tx.fill.transactionHash, toDomain?.chain),
          }
        : // assume immediate confirmation for rollups
        tx.deposit.timestamp || tx.fromChainId
        ? {
            label: "Waiting",
            status: ProgressRowStatus.InProgress,
            time: l2ConfirmationText,
          }
        : {
            label: "Fill",
            status: ProgressRowStatus.NotDone,
            time: l2ConfirmationText,
          },
    ];
  };
};
