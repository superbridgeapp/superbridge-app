import { useTranslation } from "react-i18next";

import { useAcrossDomains } from "@/hooks/use-across-domains";
import { useFinalizationPeriod } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { AcrossBridgeDto } from "@/types/across";

import { transactionLink } from "../transaction-link";
import { ExpandedItem, ProgressRowStatus } from "./common";

export const useAcrossProgressRows = () => {
  const { t } = useTranslation();
  const transformPeriodText = usePeriodText();
  const finalizationPeriod = useFinalizationPeriod();

  const acrossDomains = useAcrossDomains();
  return (tx: AcrossBridgeDto): ExpandedItem[] => {
    // const bridgeTime = getFinalizationPeriod(tx.deployment, true);

    const fromDomain = acrossDomains.find((x) => x.chain.id === tx.fromChainId);
    const toDomain = acrossDomains.find((x) => x.chain.id === tx.toChainId);

    const l2ConfirmationText = (() => {
      return "l2ConfirmationText";
      // if (!bridgeTime || tx.relay) return "";
      // if (!tx.bridge.blockNumber) {
      //   return transformPeriodText("transferTime", {}, bridgeTime);
      // }

      // const remainingTimePeriod = getRemainingTimePeriod(
      //   tx.bridge.timestamp,
      //   bridgeTime
      // );
      // if (!remainingTimePeriod) return "";
      // return transformPeriodText("activity.remaining", {}, remainingTimePeriod);
    })();
    return [
      {
        label: tx.deposit.timestamp
          ? t("activity.bridged")
          : t("activity.bridging"),
        status: tx.deposit.timestamp
          ? ProgressRowStatus.Done
          : ProgressRowStatus.InProgress,
        link: transactionLink(tx.deposit.transactionHash, fromDomain?.chain),
      },
      tx.fill
        ? {
            label: "Filled",
            status: ProgressRowStatus.Done,
            link: transactionLink(tx.fill.transactionHash, toDomain?.chain),
          }
        : {
            label: "Waiting",
            status: ProgressRowStatus.InProgress,
            // link: undefined,
            // text: "Not long to go",
          },
    ];
  };
};
