import { useEffect, useState } from "react";

import {
  IconArrowUpRight,
  IconCheckCircle,
  IconSimpleGas,
  IconSpinner,
  IconTime,
} from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import { useNetworkFeeForGasLimit } from "@/hooks/gas/use-network-fee";
import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  WaitStep,
  isWaitStep,
  isWaitStepDone,
  isWaitStepInProgress,
} from "@/hooks/use-progress-rows/common";
import { Transaction } from "@/types/transaction";
import { formatDuration, formatDurationToNow } from "@/utils/get-period";
import {
  isArbitrumDeposit,
  isArbitrumWithdrawal,
  isCctpBridge,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
} from "@/utils/guards";
import { transactionLink } from "@/utils/transaction-link";

import {
  Finalise,
  FinaliseArbitrum,
  MintCctp,
  Prove,
  RedeemArbitrum,
} from "./transaction-buttons";
import { Skeleton } from "./ui/skeleton";

function WaitLineItem({
  step,
  tx,
}: {
  step: WaitStep;
  tx?: Pick<Transaction, "type">;
}) {
  const [remainingDuration, setRemainingDuration] = useState<string | null>(
    formatDuration(Date.now(), Date.now() + step.duration)
  );

  useEffect(() => {
    let interval = null;
    if (isWaitStepInProgress(step)) {
      const updateDuration = () => {
        const remaining = formatDuration(
          Date.now(),
          step.startedAt + step.duration
        );
        setRemainingDuration(remaining);
      };

      updateDuration();
      interval = setInterval(updateDuration, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [step]);

  return (
    <div className="flex gap-4 justify-start items-center w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="w-6 h-6 rounded-full bg-card mx-1">
          <IconTime className="w-6 h-6 fill-foreground" />
        </div>

        <span className="text-sm font-heading leading-none">
          {tx?.type === "across-bridge"
            ? "Wait a short moment"
            : `Wait ${formatDurationToNow(Date.now() + step.duration)}`}
        </span>

        <span className="ml-auto">
          {isWaitStepDone(step) ? (
            <IconCheckCircle className="w-6 h-6 fill-primary" />
          ) : isWaitStepInProgress(step) &&
            step.startedAt + step.duration > Date.now() ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                ~{remainingDuration} to go
              </span>
              <IconSpinner className="h-6 w-6 p-0.5 text-foreground fill-foreground" />
            </div>
          ) : (
            ""
          )}
        </span>
      </div>
    </div>
  );
}

function TransactionLineItem({
  step,
  tx,
}: {
  step: TransactionStep;
  tx?: Pick<Transaction, "type">;
}) {
  const fee = useNetworkFeeForGasLimit(step.chain.id, step.gasLimit);

  // transaction steps have three basic states
  // done, has a transaction hash
  // submitting, has a pending transaction hash
  // ready, has a button hash
  // not done, ie no transaction hash

  return (
    <div className="flex flex-col">
      <div className="flex gap-1 justify-between items-center relative">
        <div className="flex items-center gap-1.5">
          <NetworkIcon chain={step.chain} className="w-8 h-8 rounded-[10px]" />
          <div className="flex flex-col gap-1 justify-center">
            <span className="text-sm font-heading leading-none">
              {step.label}
            </span>

            {/* View Txn */}
            {step.hash && (
              <a
                href={transactionLink(step.hash, step.chain)}
                target="_blank"
                className="text-muted-foreground flex gap-1 items-center text-xs group hover:text-foreground -mt-0.5"
              >
                <span>View in explorer</span>
                <IconArrowUpRight className="w-2 h-2 fill-muted-foreground group-hover:fill-foreground" />
              </a>
            )}

            {/* Gas and fees */}
            {!!step.gasLimit && !step.pendingHash && !step.hash && (
              <div className="flex gap-1 items-center">
                <IconSimpleGas className="w-3 h-auto fill-muted-foreground" />
                {fee.isLoading ? (
                  <Skeleton className="h-4 w-[88px]" />
                ) : (
                  <>
                    <span className="text-xs text-muted-foreground leading-none">
                      {fee.data?.token.formatted}
                    </span>
                    {fee.data?.fiat?.formatted && (
                      <span className="text-xs text-muted-foreground leading-none  opacity-50">
                        {fee.data?.fiat?.formatted}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 items-end">
          {step.hash ? (
            <div className="flex gap-2 items-center group">
              <IconCheckCircle className="w-6 h-6 fill-primary" />
            </div>
          ) : step.pendingHash ? (
            <a
              href={transactionLink(step.pendingHash, step.chain)}
              target="_blank"
            >
              <IconSpinner className="h-6 w-6" />
            </a>
          ) : (
            <>
              {tx &&
                step.button?.type === ButtonComponent.Prove &&
                (isOptimismWithdrawal(tx) ||
                  isOptimismForcedWithdrawal(tx)) && (
                  <Prove tx={tx} enabled={step.button.enabled} />
                )}
              {tx &&
                step.button?.type === ButtonComponent.Finalise &&
                (isOptimismWithdrawal(tx) ||
                  isOptimismForcedWithdrawal(tx)) && (
                  <Finalise tx={tx} enabled={step.button.enabled} />
                )}
              {tx &&
                step.button?.type === ButtonComponent.Finalise &&
                isArbitrumWithdrawal(tx) && (
                  <FinaliseArbitrum tx={tx} enabled={step.button.enabled} />
                )}
              {tx &&
                step.button?.type === ButtonComponent.Mint &&
                isCctpBridge(tx) && (
                  <MintCctp tx={tx} enabled={step.button.enabled} />
                )}
              {tx &&
                step.button?.type === ButtonComponent.Redeem &&
                isArbitrumDeposit(tx) && (
                  <RedeemArbitrum tx={tx} enabled={step.button.enabled} />
                )}

              {step.buttonComponent}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function LineItem(props: {
  step: ActivityStep;
  tx?: Pick<Transaction, "type">;
}) {
  return (
    <div className="px-4 py-3.5 rounded-xl bg-muted">
      {isWaitStep(props.step) ? (
        <WaitLineItem {...props} step={props.step} />
      ) : (
        <TransactionLineItem {...props} step={props.step} />
      )}
    </div>
  );
}
