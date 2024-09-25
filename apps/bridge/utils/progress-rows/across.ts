import { useTranslation } from "react-i18next";

import { useAcrossDomains } from "@/hooks/across/use-across-domains";
import { useTxMultichainToken } from "@/hooks/activity/use-tx-token";
import { Transaction } from "@/types/transaction";

import { isAcrossBridge } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useAcrossProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const acrossDomains = useAcrossDomains();
  const token = useTxMultichainToken(tx);

  if (!tx || !isAcrossBridge(tx)) {
    return null;
  }

  const fromDomain = acrossDomains.find((x) => x.chain.id === tx.fromChainId);
  const toDomain = acrossDomains.find((x) => x.chain.id === tx.toChainId);
  if (!fromDomain?.chain || !toDomain?.chain) {
    return null;
  }

  return [
    {
      label: t("confirmationModal.startBridgeOn", {
        from: fromDomain.chain.name,
      }),
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      chain: fromDomain.chain,
      button: undefined,
      fee: undefined,
      token,
    },
    buildWaitStep(tx.deposit.timestamp, tx.fill?.timestamp, 2 * 1000 * 60),
    {
      label: t("confirmationModal.getOn", {
        to: toDomain.chain.name,
      }),
      hash: tx.fill?.transactionHash,
      pendingHash: undefined,
      chain: toDomain.chain,
      button: undefined,
      fee: undefined,
      token,
    },
  ];
};
