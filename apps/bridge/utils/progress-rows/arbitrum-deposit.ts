import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { useChain } from "@/hooks/use-chain";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isArbitrumDeposit } from "../guards";
import { ActivityStep, ButtonComponent, buildWaitStep } from "./common";

export const useArbitrumDepositProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const l1 = useChain(deployment?.l1ChainId);
  const l2 = useChain(deployment?.l2ChainId);
  const pendingFinalises = usePendingTransactions.usePendingFinalises();

  if (!tx || !isArbitrumDeposit(tx) || !deployment || !l1 || !l2) {
    return null;
  }

  const receive = tx.relay
    ? {
        label: t("Receive"),
        button: undefined,
        chain: l2,
        hash: tx.relay.transactionHash,
        pendingHash: undefined,
        fee: undefined,
      }
    : tx.deposit.timestamp && tx.deposit.timestamp < Date.now() - 1000 * 60 * 60
    ? {
        label: "Manual relay required",
        fee: undefined, // todo
        button: {
          type: ButtonComponent.Redeem,
          enabled: true,
        },
        chain: l2,
        hash: undefined,
        pendingHash: pendingFinalises[tx.id],
      }
    : {
        label: t("Receive"),
        button: undefined,
        chain: l2,
        fee: undefined,
        hash: undefined,
        pendingHash: undefined,
      };

  return [
    {
      label: "Bridge",
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      button: undefined,
      chain: l1,
    },
    buildWaitStep(
      tx.deposit.timestamp,
      tx.relay?.timestamp,
      deployment.depositDuration
    ),
    receive,
  ];
};
