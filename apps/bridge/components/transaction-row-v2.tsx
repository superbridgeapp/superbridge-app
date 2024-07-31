import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";

import {
  ConfirmationDto,
  ConfirmationDtoV2,
  TransactionStatus,
} from "@/codegen/model";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxDeployment } from "@/hooks/activity/use-tx-deployment";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { useTxProvider } from "@/hooks/activity/use-tx-provider";
import { useTxTimestamp } from "@/hooks/activity/use-tx-timestamp";
import { useTxToken } from "@/hooks/activity/use-tx-token";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isArbitrumWithdrawal,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
  isWithdrawal,
} from "@/utils/guards";
import { isOptimism } from "@/utils/is-mainnet";

import { MessageStatus } from "../constants";
import { NetworkIcon } from "./network-icon";
import { RouteProviderIcon } from "./route-provider-icon";
import { TokenIcon } from "./token-icon";

const useNextStateChangeTimestamp = (tx: Transaction) => {
  const initiatingTx = useInitiatingTx(tx);
  const deployment = useTxDeployment(tx);

  if (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) {
    const withdrawal = isOptimismWithdrawal(tx) ? tx : tx.withdrawal;
    const status = isOptimismWithdrawal(tx) ? tx.status : tx.withdrawal?.status;
    if (!withdrawal || !status) {
      return null;
    }

    if (status === MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
      return {
        description:
          !!deployment &&
          isOptimism(deployment) &&
          deployment?.contractAddresses.disputeGameFactory
            ? "Waiting for dispute game"
            : "Waiting for state root",
        timestamp: withdrawal.withdrawal.timestamp + withdrawal.proveDuration,
      };
    }

    if (withdrawal.prove && status === MessageStatus.IN_CHALLENGE_PERIOD) {
      return {
        description: "challenge period",
        timestamp: withdrawal.prove.timestamp + withdrawal.finalizeDuration,
      };
    }

    return null;
  }

  if (isConfirmed(initiatingTx)) {
    return {
      timestamp: initiatingTx.timestamp + tx.duration,
      description: "",
    };
  }

  return null;
};

const useStatus = (
  tx: Transaction
):
  | { description: string; button: string }
  | { description: string; timestamp: number }
  | null => {
  const action = useAction(tx);
  const chains = useTxFromTo(tx);
  const nextStateChangeTimestamp = useNextStateChangeTimestamp(tx);

  if (!chains) {
    return null;
  }

  if (action === "prove") {
    return {
      description: `Ready to prove on ${chains.to.name}`,
      button: "Prove",
    };
  }

  if (action === "finalize") {
    return {
      description: `Ready to finalize on ${chains.to.name}`,
      button: "Finalize",
    };
  }

  if (action === "mint") {
    return {
      description: `Ready to mint on ${chains.to.name}`,
      button: "Mint",
    };
  }

  return nextStateChangeTimestamp;
};

const ActionRow = ({ tx }: { tx: Transaction }) => {
  const status = useStatus(tx);

  if (!status) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-between">
      <span>{status.description}</span>

      {(status as any).button && (
        <button className="bg-blue-100"> Prove</button>
      )}

      {(status as any).timestamp && (status as any).timestamp > Date.now() && (
        <span className="bg-blue-100">
          ~{formatDistanceToNow((status as any).timestamp)}
        </span>
      )}
    </div>
  );
};

type PendingConfirmationDto = {
  transactionHash: string;
};

const isPendingConfirmationDto = (
  tx: PendingConfirmationDto | ConfirmationDto | ConfirmationDtoV2
): tx is PendingConfirmationDto => {
  return !(tx as ConfirmationDto).timestamp;
};

const isConfirmed = (
  tx: PendingConfirmationDto | ConfirmationDto | ConfirmationDtoV2
): tx is ConfirmationDto | ConfirmationDtoV2 => {
  return !!(tx as ConfirmationDto).timestamp;
};

const useInitiatingTx = (
  tx: Transaction
): PendingConfirmationDto | ConfirmationDto | ConfirmationDtoV2 => {
  if (isAcrossBridge(tx)) return tx.deposit;
  if (isHyperlaneBridge(tx)) return tx.send;
  if (isDeposit(tx)) return tx.deposit;
  if (isWithdrawal(tx)) return tx.withdrawal;
  if (isForcedWithdrawal(tx)) return tx.deposit.deposit;
  return tx.bridge;
};

const useFinalisingTx = (tx: Transaction) => {
  if (isAcrossBridge(tx)) return tx.fill;
  if (isHyperlaneBridge(tx)) return tx.receive;
  if (isDeposit(tx)) return tx.relay;
  if (isWithdrawal(tx)) return tx.finalise;
  if (isForcedWithdrawal(tx)) return tx.withdrawal?.finalise;
  return tx.relay;
};

const useIsSuccessfulBridge = (tx: Transaction) => {
  const finalTx = useFinalisingTx(tx);
  return finalTx?.status === TransactionStatus.confirmed;
};

const useIsInProgress = (tx: Transaction) => {
  const finalTx = useFinalisingTx(tx);
  return !finalTx;
};

const useAction = (tx: Transaction) => {
  if (isAcrossBridge(tx) || isHyperlaneBridge(tx) || isDeposit(tx)) {
    return null;
  }

  if (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) {
    const status = isOptimismWithdrawal(tx) ? tx.status : tx.withdrawal?.status;
    if (!status) {
      return null;
    }

    return status === MessageStatus.READY_TO_PROVE
      ? "prove"
      : status === MessageStatus.READY_FOR_RELAY
      ? "finalize"
      : null;
  }

  if (isArbitrumWithdrawal(tx)) {
    return tx.status === ArbitrumMessageStatus.CONFIRMED ? "finalize" : null;
  }

  if (isCctpBridge(tx)) {
    return tx.bridge.timestamp + tx.duration > Date.now() ? "mint" : null;
  }

  return null;
};

const useProgressBars = (
  tx: Transaction
): { status: "done" | "in-progress" | "not-started"; name: string }[] => {
  const initiatingTx = useInitiatingTx(tx);
  const finalisingTx = useFinalisingTx(tx);
  const proveTx = isOptimismWithdrawal(tx)
    ? tx.prove
    : isOptimismForcedWithdrawal(tx)
    ? tx.withdrawal?.prove
    : null;
  const pendingProves = usePendingTransactions.usePendingProves();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();

  const bars: {
    status: "done" | "in-progress" | "not-started";
    name: string;
  }[] = [];
  if (isConfirmed(initiatingTx)) {
    bars.push({ status: "done", name: "initiating" });
  } else {
    bars.push({ status: "in-progress", name: "initiating" });
  }

  if (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) {
    if (proveTx) {
      bars.push({ status: "done", name: "prove" });
    } else if (!isConfirmed(initiatingTx)) {
      bars.push({ status: "not-started", name: "prove" });
    } else {
      bars.push({ status: "in-progress", name: "prove" });
    }

    if (finalisingTx) {
      bars.push({ status: "done", name: "prove" });
    } else if (proveTx || pendingFinalises[tx.id]) {
      bars.push({ status: "in-progress", name: "prove" });
    } else {
      bars.push({ status: "not-started", name: "prove" });
    }

    return bars;
  }

  if (finalisingTx) {
    bars.push({ status: "done", name: "finalise" });
  } else {
    bars.push({ status: "in-progress", name: "finalise" });
  }

  return bars;
};

export const TransactionRowV2 = ({ tx }: { tx: Transaction }) => {
  const token = useTxToken(tx);

  const chains = useTxFromTo(tx);
  const openModal = useConfigState.useAddModal();
  const openActivityModal = useModalsState.useSetActivityId();
  const timestamp = useTxTimestamp(tx);
  const amount = useTxAmount(tx, token);

  const isSuccessful = useIsSuccessfulBridge(tx);
  const isInProgress = useIsInProgress(tx);
  const finalizingTx = useFinalisingTx(tx);
  const bars = useProgressBars(tx);
  const provider = useTxProvider(tx);

  console.log(isSuccessful);
  return (
    <div className="flex flex-col p-6 border-b relative" key={tx.id}>
      <button
        className="border border-1"
        onClick={() => openActivityModal(tx.id)}
      >
        Open details
      </button>
      <div className="flex items-center gap-3">
        <span>Route:</span>
        <RouteProviderIcon provider={provider} />
      </div>
      <div>
        Initiated:{" "}
        {timestamp ? `${formatDistanceToNow(timestamp)} ago` : "just now"}
      </div>
      <div className="flex items-center gap-3">
        <span>Token:</span>
        <TokenIcon token={token ?? null} className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-3">
        <span>From:</span>
        <NetworkIcon chain={chains?.from} className="h-6 w-6" />
      </div>
      <div className="flex items-center gap-3">
        <span>To:</span>
        <NetworkIcon chain={chains?.to} className="h-6 w-6" />
      </div>
      <div>Amount: {amount}</div>

      {isSuccessful ? (
        <div>
          Bridge successful :{" "}
          {formatDistanceToNow(finalizingTx?.timestamp ?? 0)} ago
        </div>
      ) : isInProgress ? (
        <div>
          <div className="w-full flex items-center gap-2">
            {bars.map((bar) => (
              <div
                key={bar.status}
                className={clsx(
                  "w-full h-1",
                  bar.status === "done" && "bg-blue-500",
                  bar.status === "in-progress" && "bg-blue-400 animate-pulse",
                  bar.status === "not-started" && "bg-gray-500"
                )}
              ></div>
            ))}
          </div>

          <ActionRow tx={tx} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
