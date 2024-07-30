import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";

import { IconSimpleGas, IconSpinner, IconTime } from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
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
  isWaitStep,
  isWaitStepInProgress,
} from "@/utils/progress-rows/common";
import { transactionLink } from "@/utils/transaction-link";

import {
  Finalise,
  FinaliseArbitrum,
  MintCctp,
  Prove,
  RedeemArbitrum,
} from "./transaction-row";

export function TransactionLineItem({
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

          <span>{duration}</span>

          {isWaitStepInProgress(step) && (
            <>
              {step.startedAt + step.duration < Date.now() ? (
                <div className="ml-auto">✅</div>
              ) : (
                <span>~{formatDistanceToNow(step.startedAt)} to go</span>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // transaction steps have three basic states

  // done, has a transaction hash
  // submitting, has a pending transaction hash
  // ready, has a button hash
  // not done, ie no transaction hash

  return (
    <div
      className={clsx(
        "flex gap-4 px-3 py-4 rounded-lg justify-between bg-muted"
      )}
    >
      <div
        className={clsx(
          "flex gap-2",
          step.fee ? "items-start" : "items-center"
        )}
      >
        <NetworkIcon chain={step.chain} className="w-8 h-8" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-heading leading-none">
            {step.label}
          </span>
          {step.fee && (
            <div className="flex gap-1">
              <IconSimpleGas className="w-3.5 h-auto fill-muted-foreground opacity-80" />
              <span className="text-xs text-muted-foreground leading-none">
                <p className="text-xs">{step.fee}</p>
              </span>
            </div>
          )}
        </div>
      </div>

      {step.hash && (
        <div>
          <a href={transactionLink(step.hash, step.chain)} target="_blank">
            Link
          </a>
        </div>
      )}

      {step.pendingHash && (
        <div>
          <a
            href={transactionLink(step.pendingHash, step.chain)}
            target="_blank"
          >
            <IconSpinner />
          </a>
        </div>
      )}

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
      {tx && step.button?.type === ButtonComponent.Mint && isCctpBridge(tx) && (
        <MintCctp tx={tx} enabled={step.button.enabled} />
      )}
      {tx &&
        step.button?.type === ButtonComponent.Redeem &&
        isArbitrumDeposit(tx) && (
          <RedeemArbitrum tx={tx} enabled={step.button.enabled} />
        )}

      {step.buttonComponent}
    </div>
  );
}
