import { useTranslation } from "react-i18next";

import {
  AcrossBridgeDto,
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  ForcedWithdrawalDto,
  PortalDepositDto,
} from "@/codegen/model";
import { useDeployments } from "@/hooks/use-deployments";
import { Transaction } from "@/types/transaction";
import { useArbitrumDepositProgressRows } from "@/utils/progress-rows/arbitrum-deposit";
import { useArbitrumWithdrawalProgressRows } from "@/utils/progress-rows/arbitrum-withdrawal";
import { useCctpProgressRows } from "@/utils/progress-rows/cctp";
import { useOptimismDepositProgressRows } from "@/utils/progress-rows/deposit";
import {
  useArbitrumForcedWithdrawalProgressRows,
  useOptimismForcedWithdrawalProgressRows,
} from "@/utils/progress-rows/forced-withdrawal";
import { useOptimismWithdrawalProgressRows } from "@/utils/progress-rows/withdrawal";

import {
  isAcrossBridge,
  isDeposit,
  isForcedWithdrawal,
  isWithdrawal,
} from "../guards";
import { useAcrossProgressRows } from "./across";

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

export const useProgressRows = () => {
  const optimismDeposit = useOptimismDepositProgressRows();
  const optimismWithdrawal = useOptimismWithdrawalProgressRows();
  const optimismForcedWithdrawal = useOptimismForcedWithdrawalProgressRows();
  const arbitrumDeposit = useArbitrumDepositProgressRows();
  const arbitrumWithdrawal = useArbitrumWithdrawalProgressRows();
  const arbitrumForcedWithdrawal = useArbitrumForcedWithdrawalProgressRows();
  const cctp = useCctpProgressRows();
  const across = useAcrossProgressRows();
  const deployments = useDeployments();

  return (tx: Transaction) => {
    const deploymentId = isAcrossBridge(tx)
      ? ""
      : isForcedWithdrawal(tx)
      ? tx.deposit.deploymentId
      : tx.deploymentId;
    const deployment = deployments.find((x) => deploymentId === x.id) ?? null;

    if (tx.type === "deposit")
      return optimismDeposit(tx as PortalDepositDto, deployment);
    if (tx.type === "withdrawal") {
      const w = tx as BridgeWithdrawalDto;
      return optimismWithdrawal(w, deployment);
    }
    if (tx.type === "forced-withdrawal")
      return optimismForcedWithdrawal(tx as ForcedWithdrawalDto, deployment);
    if (
      tx.type === "arbitrum-deposit-eth" ||
      tx.type === "arbitrum-deposit-retryable"
    )
      return arbitrumDeposit(
        tx as ArbitrumDepositEthDto | ArbitrumDepositRetryableDto,
        deployment
      );
    if (tx.type === "arbitrum-withdrawal")
      return arbitrumWithdrawal(tx as ArbitrumWithdrawalDto, deployment);
    if (tx.type === "arbitrum-forced-withdrawal")
      return arbitrumForcedWithdrawal(
        tx as ArbitrumForcedWithdrawalDto,
        deployment
      );
    if (tx.type === "across-bridge") return across(tx as AcrossBridgeDto);
    return cctp(tx as CctpBridgeDto, deployment);
  };
};
