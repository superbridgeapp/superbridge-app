import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";

import { IconSimpleGas, IconSpinner, IconTime } from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import { useNetworkFeeForGasLimit } from "@/hooks/use-network-fee";
import { Transaction } from "@/types/transaction";
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
  isWaitStep,
  isWaitStepDone,
  isWaitStepInProgress,
} from "@/utils/progress-rows/common";
import { transactionLink } from "@/utils/transaction-link";

import {
  Finalise,
  FinaliseArbitrum,
  MintCctp,
  Prove,
  RedeemArbitrum,
} from "./transaction-buttons";
import { Skeleton } from "./ui/skeleton";

export function LineItem({
  step,
  tx,
}: {
  step: ActivityStep;
  tx?: Pick<Transaction, "type">;
}) {
  if (isWaitStep(step)) {
    const duration = formatDistanceToNow(Date.now() - step.duration);

    return (
      <div className="flex gap-4 px-3 py-2 rounded-lg justify-start items-center w-full">
        <div className="flex items-center gap-2 w-full">
          <IconTime className="w-8 h-8" />

          <span className="text-xs">{duration}</span>

          <span className="ml-auto text-xs">
            {isWaitStepDone(step)
              ? "✅"
              : isWaitStepInProgress(step)
              ? ` ~${formatDistanceToNow(step.startedAt + step.duration)} to go`
              : ""}
          </span>
        </div>
      </div>
    );
  }

  return <TransactionLineItem tx={tx} step={step} />;
}

export function TransactionLineItem({
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
    <div
      className={clsx(
        "flex gap-4 px-3 py-4 rounded-lg justify-between bg-muted items-center"
      )}
    >
      <div
        className={clsx(
          "flex gap-2",
          fee.data ? "items-start" : "items-center"
        )}
      >
        <NetworkIcon chain={step.chain} className="w-8 h-8" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-heading leading-none">
            {step.label}
          </span>

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
        </div>
      </div>

      {step.hash ? (
        <a href={transactionLink(step.hash, step.chain)} target="_blank">
          Link
        </a>
      ) : step.pendingHash ? (
        <a href={transactionLink(step.pendingHash, step.chain)} target="_blank">
          <IconSpinner className="h-4 w-4" />
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
