import { useTranslation } from "react-i18next";

import { useTxCctpDomains } from "@/hooks/activity/use-tx-cctp-domains";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isCctpBridge } from "../guards";
import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  buildWaitStep,
} from "./common";

export const useCctpProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const domains = useTxCctpDomains(tx);

  if (!tx || !isCctpBridge(tx) || !domains) {
    return null;
  }

  const pendingFinalise = pendingFinalises[tx?.id ?? ""];

  const burn: TransactionStep = {
    label: "burn",
    hash: tx.bridge.timestamp ? tx.bridge.transactionHash : undefined,
    pendingHash: tx.bridge.timestamp ? undefined : tx.bridge.transactionHash,
    chain: tx.from,
    button: undefined,
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
          gasLimit: BigInt(100_000),
        }
      : {
          label: "mint",
          hash: tx.relay?.transactionHash,
          pendingHash: pendingFinalise,
          chain: tx.to,
          button: undefined,
          gasLimit: tx.relay ? undefined : BigInt(100_000),
        };

  return [
    burn,
    buildWaitStep(
      tx.bridge.timestamp,
      tx.relay?.timestamp,
      domains.from.duration
    ),
    mint,
  ];
};
