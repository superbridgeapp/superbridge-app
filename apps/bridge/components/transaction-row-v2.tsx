import clsx from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { useEffect, useState } from "react";

import {
  ConfirmationDto,
  ConfirmationDtoV2,
  TransactionStatus,
} from "@/codegen/model";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { useFinalisingTx } from "@/hooks/activity/use-finalising-tx";
import { useInitiatingTx } from "@/hooks/activity/use-initiating-tx";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxDeployment } from "@/hooks/activity/use-tx-deployment";
import { useTxDuration } from "@/hooks/activity/use-tx-duration";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { useTxProvider } from "@/hooks/activity/use-tx-provider";
import { useTxTimestamp } from "@/hooks/activity/use-tx-timestamp";
import { useTxToken } from "@/hooks/activity/use-tx-token";
import { useProviderName } from "@/hooks/providers/use-provider-name";
import { useModal } from "@/hooks/use-modal";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";
import { isOptimism } from "@/utils/deployments/is-mainnet";
import { formatDurationToNow } from "@/utils/get-period";
import {
  isAcrossBridge,
  isArbitrumWithdrawal,
  isCctpBridge,
  isDeposit,
  isHyperlaneBridge,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
} from "@/utils/guards";
import { getInitiatingHash } from "@/utils/initiating-tx-hash";

import { MessageStatus } from "../constants";
import {
  IconCaretRight,
  IconCheckCircle,
  IconSimpleTime,
  IconSpinner,
  IconTime,
  IconTx,
} from "./icons";
import { NetworkIcon } from "./network-icon";
import { TokenIcon } from "./token-icon";
import { Button } from "./ui/button";

const useNextStateChangeTimestamp = (tx: Transaction) => {
  const initiatingTx = useInitiatingTx(tx);
  const deployment = useTxDeployment(tx);
  const chains = useTxFromTo(tx);
  const duration = useTxDuration(tx);

  if (!initiatingTx) {
    return null;
  }

  if (!isConfirmed(initiatingTx)) {
    return {
      description: "Submitting bridge",
    };
  }

  if (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) {
    if (isOptimismForcedWithdrawal(tx) && !tx.withdrawal) {
      return {
        description: "Waiting for rollup withdrawal",
        timestamp: initiatingTx.timestamp + (deployment?.depositDuration ?? 0),
      };
    }

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
        timestamp:
          withdrawal.withdrawal.timestamp + (deployment?.proveDuration ?? 0),
      };
    }

    if (withdrawal.prove && status === MessageStatus.IN_CHALLENGE_PERIOD) {
      return {
        description: "Challenge period",
        timestamp:
          withdrawal.prove.timestamp + (deployment?.finalizeDuration ?? 0),
      };
    }

    return null;
  }

  let description = "";

  if (isArbitrumWithdrawal(tx)) {
    return {
      description: "In challenge period",
      timestamp: initiatingTx.timestamp + (deployment?.finalizeDuration ?? 0),
    };
  } else if (isCctpBridge(tx)) {
    description = "Waiting for Circle attestation";
  } else {
    description = `Waiting for confirmation on ${chains?.to.name}`;
  }

  return {
    timestamp: initiatingTx.timestamp + (duration ?? 0),
    description,
  };
};

type ActionStatus = { description: string; button: string };
type WaitStatus = { description: string; timestamp: number };
type GeneralStatus = { description: string };
type NoStatus = null;

type Status = ActionStatus | WaitStatus | NoStatus | GeneralStatus;

const isActionStatus = (x: Status): x is ActionStatus => {
  return !!(x as ActionStatus | NoStatus)?.button;
};

const isWaitStatus = (x: Status): x is WaitStatus => {
  return !!(x as WaitStatus | NoStatus)?.timestamp;
};

const isGeneralStatus = (x: Status): x is GeneralStatus => {
  return !!(x as GeneralStatus)?.description;
};

const useStatus = (tx: Transaction): Status => {
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
  const modal = useModal("TransactionDetails");

  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (status && isWaitStatus(status)) {
      const updateTimeRemaining = () => {
        setTimeRemaining(formatDurationToNow(status.timestamp));
      };

      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 5_000);

      return () => clearInterval(interval);
    }
  }, [status]);

  if (!status) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-between gap-2">
      {/* <div className="flex gap-2 items-center rounded-full border pl-2 pr-3 py-1.5">
              <IconCheckCircle className="fill-primary w-4 h-4" />
              <span className="text-xs lg:text-sm">Bridge successful</span>
            </div> */}
      <div className="flex gap-2 items-center rounded-full  py-1.5">
        <IconSpinner className="fill-muted-foreground text-muted-foreground w-4 h-4" />
        <span className="text-xs lg:text-sm leading-none text-muted-foreground">
          {status.description}
        </span>
      </div>

      {isActionStatus(status) ? (
        <Button size={"sm"} onClick={() => modal.open(getInitiatingHash(tx))}>
          {status.button}
        </Button>
      ) : isWaitStatus(status) && status.timestamp > Date.now() ? (
        <div
          className="border rounded-full flex items-center gap-2 p-2 pl-3 cursor-pointer"
          onClick={() => modal.open(getInitiatingHash(tx))}
        >
          <span className="text-xs lg:text-sm text-muted-foreground leading-none">
            ~{timeRemaining} to go
          </span>
          <IconTime className="w-4 h-4 fill-muted-foreground animate-wiggle-waggle" />
        </div>
      ) : (
        isGeneralStatus(status) && (
          <Button
            onClick={() => modal.open(getInitiatingHash(tx))}
            size={"xs"}
            variant={"secondary"}
          >
            <IconTx className="fill-foreground w-3 h-3 md:w-4 md:h-4" />
          </Button>
        )
      )}
    </div>
  );
};

type PendingConfirmationDto = {
  transactionHash: string;
};

const isConfirmed = (
  tx: PendingConfirmationDto | ConfirmationDto | ConfirmationDtoV2
): tx is ConfirmationDto | ConfirmationDtoV2 => {
  return !!(tx as ConfirmationDto).timestamp;
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
    return tx.bridge.timestamp + tx.duration < Date.now() ? "mint" : null;
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
  const pendingFinalises = usePendingTransactions.usePendingFinalises();

  const bars: {
    status: "done" | "in-progress" | "not-started";
    name: string;
  }[] = [];
  if (initiatingTx && isConfirmed(initiatingTx)) {
    bars.push({ status: "done", name: "initiating" });
  } else {
    bars.push({ status: "in-progress", name: "initiating" });
  }

  if (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) {
    if (proveTx) {
      bars.push({ status: "done", name: "prove" });
    } else if (initiatingTx && !isConfirmed(initiatingTx)) {
      bars.push({ status: "not-started", name: "prove" });
    } else {
      bars.push({ status: "in-progress", name: "prove" });
    }

    if (finalisingTx) {
      bars.push({ status: "done", name: "finalise" });
    } else if (proveTx || pendingFinalises[tx.id]) {
      bars.push({ status: "in-progress", name: "finalise" });
    } else {
      bars.push({ status: "not-started", name: "finalise" });
    }

    return bars;
  }

  if (initiatingTx && !isConfirmed(initiatingTx)) {
    bars.push({ status: "not-started", name: "finalise" });
  } else if (finalisingTx) {
    bars.push({ status: "done", name: "finalise" });
  } else {
    bars.push({ status: "in-progress", name: "finalise" });
  }

  return bars;
};

export const TransactionRowV2 = ({ tx }: { tx: Transaction }) => {
  const token = useTxToken(tx);

  const chains = useTxFromTo(tx);
  const modal = useModal("TransactionDetails");
  const timestamp = useTxTimestamp(tx);
  const amount = useTxAmount(tx, token);

  const isSuccessful = useIsSuccessfulBridge(tx);
  const isInProgress = useIsInProgress(tx);
  const bars = useProgressBars(tx);

  const providerName = useProviderName(useTxProvider(tx));
  return (
    <div
      className="bg-card w-full rounded-xl flex gap-2.5 lg:gap-3 p-5 md:p-6 relative"
      key={tx.id}
      onClick={(e) => {
        e.stopPropagation();
        modal.open(getInitiatingHash(tx));
      }}
    >
      {tx.mock && (
        <div className="absolute left-2 bottom-2 text-purple-500 text-xs">
          MOCK
        </div>
      )}
      <TokenIcon token={token ?? null} className="h-12 w-12 shrink-0 p-0.5" />
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground leading-none">
              {/* Started{" "} */}
              {timestamp
                ? `${formatDistanceToNowStrict(timestamp)} ago`
                : "just now"}
            </span>
            <span className="text-2xl lg:text-3xl leading-none">
              {amount?.text}
            </span>
          </div>
          <div className="flex items-center -mt-1 gap-2">
            <span className="text-xs text-muted-foreground">
              Via {providerName}
            </span>
            <div className="flex items-center">
              <NetworkIcon
                chain={chains?.from}
                className="h-5 w-5 rounded-xs"
              />
              <NetworkIcon
                chain={chains?.to}
                className="h-5 w-5 rounded-xs -ml-0.5"
              />
            </div>
          </div>
        </div>
        {isInProgress && (
          <div>
            <div className="w-full flex items-center gap-1.5 py-3">
              {bars.map((bar) => (
                <div
                  key={`${tx.id}-${bar.name}`}
                  className={clsx(
                    "w-full h-1 rounded-full",
                    bar.status === "done" && "bg-primary",
                    bar.status === "in-progress" && "bg-primary animate-pulse",
                    bar.status === "not-started" && "bg-muted"
                  )}
                ></div>
              ))}
            </div>

            <ActionRow tx={tx} />
          </div>
        )}
        <div className="flex justify-between items-center">
          {isSuccessful && (
            <div className="flex gap-2 items-center rounded-full border pl-2 pr-3 py-1.5">
              <IconCheckCircle className="fill-primary w-4 h-4" />
              <span className="text-xs lg:text-sm">Bridge successful</span>
            </div>
          )}
          {/* {isSuccessful && (
            <div className="rounded-full bg-muted px-2.5 py-2">
              <IconCaretRight className="fill-foreground w-3.5 h-3.5" />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
