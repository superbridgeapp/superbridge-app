import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { usePeriodText } from "@/hooks/use-period-text";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isCctpBridge } from "../guards";
import { ActivityStep, ButtonComponent, TransactionStep } from "./common";

export const useCctpProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const transformPeriodText = usePeriodText();

  if (!tx || !isCctpBridge(tx) || !deployment) {
    return null;
  }

  const pendingFinalise = pendingFinalises[tx?.id ?? ""];

  const burn: TransactionStep = {
    label: "burn",
    hash: tx.bridge.timestamp ? tx.bridge.transactionHash : undefined,
    pendingHash: tx.bridge.timestamp ? undefined : tx.bridge.transactionHash,
    chain: tx.from,
    button: undefined,
    fee: undefined,
  };

  const mint: TransactionStep =
    tx.bridge.timestamp < Date.now() - 30 * 60 * 1000 && !tx.relay
      ? {
          label: t("activity.readyToMint"),
          button: {
            type: ButtonComponent.Mint,
            enabled: true,
          },
          pendingHash: pendingFinalise,
          hash: undefined,
          chain: tx.to,
          fee: undefined,
        }
      : {
          label: "mint",
          hash: tx.relay?.transactionHash,
          pendingHash: pendingFinalise,
          chain: tx.to,
          button: undefined,
          fee: undefined,
        };

  return [
    burn,
    tx.bridge.timestamp
      ? {
          startedAt: tx.bridge.timestamp,
          duration: tx.duration,
        }
      : {
          duration: tx.duration,
        },
    mint,
  ];
};
