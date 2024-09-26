import clsx from "clsx";
import { useEffect, useState } from "react";

import {
  IconArrowUpRightCircle,
  IconCheckCircle,
  IconSimpleGas,
  IconSimpleTime,
  IconSpinner,
} from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import { useNetworkFeeForGasLimit } from "@/hooks/gas/use-network-fee";
import { Transaction } from "@/types/transaction";
import { formatDuration, formatDurationToNow } from "@/utils/get-period";
import {
  isArbitrumDeposit,
  isArbitrumWithdrawal,
  isCctpBridge,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
} from "@/utils/guards";
import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  WaitStep,
  isWaitStep,
  isWaitStepDone,
  isWaitStepInProgress,
} from "@/utils/progress-rows/common";
import { transactionLink } from "@/utils/transaction-link";

import { TokenIcon } from "./token-icon";
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
}: {
  step: WaitStep;
  tx?: Pick<Transaction, "type">;
}) {
  const [remainingDuration, setRemainingDuration] = useState<string | null>(
    formatDuration(Date.now(), Date.now() + step.duration)
  );

  useEffect(() => {
    if (isWaitStepInProgress(step)) {
      const updateDuration = () => {
        const remaining = formatDuration(
          Date.now(),
          step.startedAt + step.duration
        );
        setRemainingDuration(remaining);
      };

      updateDuration();
      const interval = setInterval(updateDuration, 1000);

      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="flex gap-4 justify-start items-center w-full">
      <div className="flex items-center gap-2 w-full">
        <IconSimpleTime className="w-8 h-8 p-1 fill-foreground" />

        <span className="text-sm">
          Wait {formatDurationToNow(Date.now() + step.duration)}
        </span>

        <span className="ml-auto">
          {isWaitStepDone(step) ? (
            <IconCheckCircle className="w-6 h-6 fill-primary" />
          ) : isWaitStepInProgress(step) &&
            step.startedAt + step.duration > Date.now() ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-foreground">
                ~{remainingDuration} to go
              </span>
              <IconSpinner className="h-6 w-6" />
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
    <div className="flex gap-4 justify-between items-center relative">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <NetworkIcon chain={step.chain} className="w-4 h-4 rounded-sm" />
          <span className="text-sm font-heading leading-none">
            {step.label}
          </span>
        </div>

        {step.token && (
          <div className="flex items-center gap-1">
            <TokenIcon
              token={step.token?.[step.chain.id]}
              className="h-6 w-6"
            />
            <span className="text-2xl font-heading leading-none">
              {step.amount?.formatted}
            </span>
          </div>
        )}

        <div
          className={clsx(
            "flex gap-2",
            fee.data ? "items-start" : "items-center"
          )}
        >
          <div className="flex flex-col gap-1">
            {!!step.gasLimit && (
              <div className="flex gap-1">
                <IconSimpleGas className="w-3.5 h-auto fill-muted-foreground opacity-80" />
                {fee.isLoading ? (
                  <Skeleton className="h-4 w-[88px]" />
                ) : (
                  <span className="text-xs text-muted-foreground leading-none">
                    <p className="text-xs">
                      {fee.data?.fiat?.formatted ?? fee.data?.token.formatted}
                    </p>
                  </span>
                )}
              </div>
            )}
            {!!step.fee && (
              <div className="flex gap-1">
                <IconSimpleGas className="w-3.5 h-auto fill-muted-foreground opacity-80" />
                <span className="text-xs text-muted-foreground leading-none">
                  <p className="text-xs">{step.fee}</p>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {step.hash ? (
        <a
          href={transactionLink(step.hash, step.chain)}
          target="_blank"
          className="flex gap-2 items-center justify-end absolute inset-0 p-3 group"
        >
          <IconArrowUpRightCircle className="w-6 h-6 fill-muted-foreground opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 fill-primary transition-all ease-in-out delay-150 absolute right-3" />
          <IconCheckCircle className="w-6 h-6 fill-primary opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-95 transition-all ease-in-out absolute right-3" />
        </a>
      ) : step.pendingHash ? (
        <a href={transactionLink(step.pendingHash, step.chain)} target="_blank">
          <IconSpinner className="h-6 w-6" />
        </a>
      ) : (
        <>
          {tx &&
            step.button?.type === ButtonComponent.Prove &&
            (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) && (
              <Prove tx={tx} enabled={step.button.enabled} />
            )}
          {tx &&
            step.button?.type === ButtonComponent.Finalise &&
            (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) && (
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
  );
}

export function LineItem(props: {
  step: ActivityStep;
  tx?: Pick<Transaction, "type">;
}) {
  return (
    <div className="px-5 py-4 rounded-lg bg-muted">
      {isWaitStep(props.step) ? (
        <WaitLineItem {...props} step={props.step} />
      ) : (
        <TransactionLineItem {...props} step={props.step} />
      )}
    </div>
  );
}
