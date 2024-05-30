import { P, match } from "ts-pattern";

import {
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
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";
import { isArbitrumDeposit, isForcedWithdrawal } from "@/utils/guards";
import { useArbitrumDepositProgressRows } from "@/utils/progress-rows/arbitrum-deposit";
import { useArbitrumWithdrawalProgressRows } from "@/utils/progress-rows/arbitrum-withdrawal";
import { useCctpProgressRows } from "@/utils/progress-rows/cctp";
import { useOptimismDepositProgressRows } from "@/utils/progress-rows/deposit";
import {
  useArbitrumForcedWithdrawalProgressRows,
  useOptimismForcedWithdrawalProgressRows,
} from "@/utils/progress-rows/forced-withdrawal";
import { useOptimismWithdrawalProgressRows } from "@/utils/progress-rows/withdrawal";

import AnimDepositProgress from "../../animation/deposit-progress.json";
import AnimDepositSuccess from "../../animation/deposit-success.json";
import AnimWithdrawProgress from "../../animation/withdraw-progress.json";
import AnimWithdrawSuccess from "../../animation/withdraw-success.json";
import { OptimismDeploymentDto } from "../is-mainnet";

interface TransactionRowProps {
  title: string;
  icon: string;
  anim: any;
  segments: number[][];
  loop: boolean;
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
        icon: "deposit-complete.png",
        anim: AnimDepositSuccess,
        segments: [[0, 20]],
        loop: false,
        items: isArbitrumDeposit(tx)
          ? useArbitrumDepositProgressRows()(tx)
          : useOptimismDepositProgressRows()(tx),
      })
    )
    .with({ deposit: P.not(undefined) }, () => ({
      title: i18n.t("deposit"),
      icon: "deposit-inprogress.png",
      anim: AnimDepositProgress,
      segments: [
        [0, 15],
        [15, 48],
      ],
      loop: true,
      items: isArbitrumDeposit(tx)
        ? useArbitrumDepositProgressRows()(tx)
        : useOptimismDepositProgressRows()(tx),
    }))
    .exhaustive();
};

const useWithdrawalProps =
  () =>
  (w: BridgeWithdrawalDto): TransactionRowProps => {
    return {
      title: i18n.t("withdraw"),
      icon: w.finalise?.transactionHash
        ? "withdraw-complete.png"
        : "withdraw-progress.png",
      anim: w.finalise?.transactionHash
        ? AnimWithdrawSuccess
        : AnimWithdrawProgress,
      segments: w.finalise?.transactionHash
        ? [[0, 20]]
        : [
            [0, 15],
            [15, 48],
          ],
      loop: w.finalise?.transactionHash ? false : true,
    };
  };

const useArbitrumWithdrawalProps =
  () =>
  (w: ArbitrumWithdrawalDto): TransactionRowProps => {
    return {
      title: i18n.t("withdraw"),
      icon: w.finalise?.transactionHash
        ? "withdraw-complete.png"
        : "withdraw-progress.png",
      anim: w.finalise?.transactionHash
        ? AnimWithdrawSuccess
        : AnimWithdrawProgress,
      segments: w.finalise?.transactionHash
        ? [[0, 20]]
        : [
            [0, 15],
            [15, 48],
          ],
      loop: w.finalise?.transactionHash ? false : true,
    };
  };

const useOptimismForcedWithdrawalProps =
  () =>
  (w: ForcedWithdrawalDto): TransactionRowProps => {
    return {
      title: `Forced exit`,
      icon: w.withdrawal?.finalise?.transactionHash
        ? "withdraw-complete.png"
        : "withdraw-progress.png",
      anim: w.withdrawal?.finalise?.transactionHash
        ? AnimWithdrawSuccess
        : AnimWithdrawProgress,
      segments: w.withdrawal?.finalise?.transactionHash
        ? [[0, 20]]
        : [
            [0, 15],
            [15, 48],
          ],
      loop: w.withdrawal?.finalise?.transactionHash ? false : true,
    };
  };

const useArbitrumForcedWithdrawalProps =
  () =>
  (w: ArbitrumForcedWithdrawalDto): TransactionRowProps => {
    return {
      title: `Forced exit`,
      icon: w.withdrawal?.finalise?.transactionHash
        ? "withdraw-complete.png"
        : "withdraw-progress.png",
      anim: w.withdrawal?.finalise?.transactionHash
        ? AnimWithdrawSuccess
        : AnimWithdrawProgress,
      segments: w.withdrawal?.finalise?.transactionHash
        ? [[0, 20]]
        : [
            [0, 15],
            [15, 48],
          ],
      loop: w.withdrawal?.finalise?.transactionHash ? false : true,
    };
  };

const useCctpProps =
  () =>
  (b: CctpBridgeDto, withdrawal: boolean): TransactionRowProps => {
    return {
      title: withdrawal ? i18n.t("withdraw") : i18n.t("deposit"),
      icon: b.relay?.blockNumber
        ? "withdraw-complete.png"
        : "withdraw-progress.png",
      anim: b.relay?.blockNumber ? AnimWithdrawSuccess : AnimWithdrawProgress,
      segments: b.relay?.blockNumber
        ? [[0, 20]]
        : [
            [0, 15],
            [15, 48],
          ],
      loop: b.relay?.blockNumber ? false : true,
    };
  };

export const useTxActivityProps = () => (tx: Transaction) => {
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();

  const deployment = isForcedWithdrawal(tx)
    ? tx.deposit.deployment
    : tx.deployment;

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
      // cctp
      .otherwise((w) => {
        const b = w as CctpBridgeDto;
        return useCctpProps()(
          w as CctpBridgeDto,
          b.from.id === deployment.l2.id
        );
      })
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
    return cctp(tx as CctpBridgeDto);
  };
};
