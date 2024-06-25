import { P, match } from "ts-pattern";

import {
  AcrossBridgeDto,
  AcrossTransactionType,
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumTransactionType,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  ForcedWithdrawalDto,
  OptimismTransactionType,
  PortalDepositDto,
} from "@/codegen/model";
import i18n from "@/services/i18n";
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

import { OptimismDeploymentDto } from "../is-mainnet";
import { useAcrossProgressRows } from "./across";

interface TransactionRowProps {
  title: string;
}

const useDepositProps = (
  tx: PortalDepositDto | ArbitrumDepositRetryableDto | ArbitrumDepositEthDto
): TransactionRowProps => {
  return match(tx)
    .with(
      {
        deposit: P.not(undefined),
        relay: P.not(undefined),
      },
      () => ({
        title: i18n.t("deposit"),
      })
    )
    .with({ deposit: P.not(undefined) }, () => ({
      title: i18n.t("deposit"),
    }))
    .exhaustive();
};

const useWithdrawalProps =
  () =>
  (w: BridgeWithdrawalDto): TransactionRowProps => {
    return {
      title: i18n.t("withdraw"),
    };
  };

const useArbitrumWithdrawalProps =
  () =>
  (w: ArbitrumWithdrawalDto): TransactionRowProps => {
    return {
      title: i18n.t("withdraw"),
    };
  };

const useOptimismForcedWithdrawalProps =
  () =>
  (w: ForcedWithdrawalDto): TransactionRowProps => {
    return {
      title: `Forced exit`,
    };
  };

const useArbitrumForcedWithdrawalProps =
  () =>
  (w: ArbitrumForcedWithdrawalDto): TransactionRowProps => {
    return {
      title: `Forced exit`,
    };
  };

const useCctpProps =
  () =>
  (b: CctpBridgeDto): TransactionRowProps => {
    return {
      title: "Bridge",
    };
  };

const useAcrossProps =
  () =>
  (b: AcrossBridgeDto): TransactionRowProps => {
    return {
      title: "Superfast bridge",
    };
  };

export const useTxActivityProps = () => (tx: Transaction) => {
  return (
    match(tx)
      .with(
        {
          type: OptimismTransactionType.deposit,
        },
        (d) => useDepositProps(d as PortalDepositDto)
      )
      .with(
        {
          type: OptimismTransactionType.withdrawal,
        },
        (d) => useWithdrawalProps()(d as BridgeWithdrawalDto)
      )
      .with(
        {
          type: OptimismTransactionType["forced-withdrawal"],
        },
        (fw) => useOptimismForcedWithdrawalProps()(fw as ForcedWithdrawalDto)
      )
      .with(
        {
          type: ArbitrumTransactionType["arbitrum-deposit-eth"],
        },
        (d) => useDepositProps(d as ArbitrumDepositEthDto)
      )
      .with(
        {
          type: ArbitrumTransactionType["arbitrum-deposit-retryable"],
        },
        (d) => useDepositProps(d as ArbitrumDepositRetryableDto)
      )
      .with(
        {
          type: ArbitrumTransactionType["arbitrum-withdrawal"],
        },
        (w) => useArbitrumWithdrawalProps()(w as ArbitrumWithdrawalDto)
      )
      .with(
        {
          type: ArbitrumTransactionType["arbitrum-forced-withdrawal"],
        },
        (w) =>
          useArbitrumForcedWithdrawalProps()(w as ArbitrumForcedWithdrawalDto)
      )
      .with(
        {
          type: AcrossTransactionType["across-bridge"],
        },
        (w) => useAcrossProps()(w as AcrossBridgeDto)
      )
      // cctp
      .otherwise((w) => useCctpProps()(w as CctpBridgeDto))
  );
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

  return (tx: Transaction) => {
    if (tx.type === "deposit") return optimismDeposit(tx as PortalDepositDto);
    if (tx.type === "withdrawal") {
      const w = tx as BridgeWithdrawalDto;
      return optimismWithdrawal(w, w.deployment as OptimismDeploymentDto);
    }
    if (tx.type === "forced-withdrawal")
      return optimismForcedWithdrawal(tx as ForcedWithdrawalDto);
    if (
      tx.type === "arbitrum-deposit-eth" ||
      tx.type === "arbitrum-deposit-retryable"
    )
      return arbitrumDeposit(
        tx as ArbitrumDepositEthDto | ArbitrumDepositRetryableDto
      );
    if (tx.type === "arbitrum-withdrawal")
      return arbitrumWithdrawal(tx as ArbitrumWithdrawalDto);
    if (tx.type === "arbitrum-forced-withdrawal")
      return arbitrumForcedWithdrawal(tx as ArbitrumForcedWithdrawalDto);
    if (tx.type === "across-bridge") return across(tx as AcrossBridgeDto);
    return cctp(tx as CctpBridgeDto);
  };
};
