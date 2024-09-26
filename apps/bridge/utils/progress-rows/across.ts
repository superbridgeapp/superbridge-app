import { useTranslation } from "react-i18next";

import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxAmountOutput } from "@/hooks/activity/use-tx-amount-output";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { useTxMultichainToken } from "@/hooks/activity/use-tx-token";
import { Transaction } from "@/types/transaction";

import { isAcrossBridge } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useAcrossProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const token = useTxMultichainToken(tx);
  const chains = useTxFromTo(tx);
  const inputAmount = useTxAmount(tx, token?.[chains?.from.id ?? 0]);
  const outputAmount = useTxAmountOutput(tx, token?.[chains?.to.id ?? 0]);

  if (!tx || !isAcrossBridge(tx) || !chains) {
    return null;
  }

  return [
    {
      label: t("confirmationModal.startBridgeOn", {
        from: chains?.from.name,
      }),
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      chain: chains.from,
      button: undefined,
      fee: undefined,
      token,
      amount: inputAmount,
    },
    buildWaitStep(tx.deposit.timestamp, tx.fill?.timestamp, 2 * 1000 * 60),
    {
      label: t("confirmationModal.getOn", {
        to: chains?.to.name,
      }),
      hash: tx.fill?.transactionHash,
      pendingHash: undefined,
      chain: chains.to,
      button: undefined,
      fee: undefined,
      token,
      amount: outputAmount,
    },
  ];
};
