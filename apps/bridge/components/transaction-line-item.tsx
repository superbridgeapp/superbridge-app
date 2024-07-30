import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";

import { IconSimpleGas, IconTime } from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import {
  ActivityStep,
  isWaitStep,
  isWaitStepInProgress,
} from "@/utils/progress-rows/common";

export function TransactionLineItem({ step }: { step: ActivityStep }) {
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
                <div className="flex items-center justify-between w-full">
                  <span>✅</span>
                </div>
              ) : (
                <span>~{formatDistanceToNow(step.startedAt)} to go</span>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

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

      {step.buttonComponent}
    </div>
  );
}
