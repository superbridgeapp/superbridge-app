import { useTranslation } from "react-i18next";

import { useDeployments } from "@/hooks/use-deployments";
import { Transaction } from "@/types/transaction";
import { useArbitrumDepositProgressRows } from "@/utils/progress-rows/arbitrum-deposit";
import { useArbitrumWithdrawalProgressRows } from "@/utils/progress-rows/arbitrum-withdrawal";
import { useCctpProgressRows } from "@/utils/progress-rows/cctp";
import { useOptimismDepositProgressRows } from "@/utils/progress-rows/deposit";
import { useOptimismForcedWithdrawalProgressRows } from "@/utils/progress-rows/forced-withdrawal";
import { useOptimismWithdrawalProgressRows } from "@/utils/progress-rows/withdrawal";

import {
  isAcrossBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isWithdrawal,
} from "../guards";
import { useAcrossProgressRows } from "./across";
import { useHyperlaneProgressRows } from "./hyperlane";

export const useTxTitle = (tx: Transaction) => {
  const { t } = useTranslation();

  if (isDeposit(tx)) {
    return t("deposit");
  }

  if (isWithdrawal(tx)) {
    return t("withdraw");
  }

  if (isForcedWithdrawal(tx)) {
    return `Forced exit`;
  }

  if (isAcrossBridge(tx)) {
    return "Superfast bridge";
  }

  // CCTP
  return "Bridge";
};

export const useProgressRows = (tx: Transaction) => {
  console.log(tx);

  const deployments = useDeployments();
  const deploymentId =
    isAcrossBridge(tx) || isHyperlaneBridge(tx)
      ? ""
      : isForcedWithdrawal(tx)
      ? tx.deposit.deploymentId
      : tx.deploymentId;
  const deployment = deployments.find((x) => deploymentId === x.id) ?? null;

  const optimismDeposit = useOptimismDepositProgressRows(tx, deployment);
  const optimismWithdrawal = useOptimismWithdrawalProgressRows(tx, deployment);
  const optimismForcedWithdrawal = useOptimismForcedWithdrawalProgressRows(
    tx,
    deployment
  );
  const arbitrumDeposit = useArbitrumDepositProgressRows(tx, deployment);
  const arbitrumWithdrawal = useArbitrumWithdrawalProgressRows(tx, deployment);
  const cctp = useCctpProgressRows(tx, deployment);
  const across = useAcrossProgressRows(tx);
  const hyperlaneProgressRows = useHyperlaneProgressRows(tx);

  return (
    optimismDeposit ||
    optimismWithdrawal ||
    optimismForcedWithdrawal ||
    arbitrumDeposit ||
    arbitrumWithdrawal ||
    cctp ||
    across ||
    hyperlaneProgressRows
  );
};
