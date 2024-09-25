import { ChainDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

export enum ProgressRowStatus {
  NotDone = "not-done",
  InProgress = "in-progress",
  Done = "done",
  Reverted = "reverted",
}

export enum ButtonComponent {
  Prove = "prove",
  Finalise = "finalise",
  Redeem = "redeem",
  Mint = "mint",
}

export type TransactionStep = {
  label: string;
  gasLimit?: bigint | undefined;
  fee?: string | undefined;
  chain: ChainDto;
  button?:
    | {
        type: ButtonComponent;
        enabled: boolean;
      }
    | undefined;
  buttonComponent?: JSX.Element;
  pendingHash: string | undefined;
  hash: string | undefined;
  token?: MultiChainToken | null;
};

export type WaitStepInProgress = {
  startedAt: number;
  duration: number;
};
export type WaitStepDone = {
  duration: number;
  done: true;
};
export type WaitStepNotStarted = {
  duration: number;
};

export type WaitStep = WaitStepInProgress | WaitStepNotStarted | WaitStepDone;

export type ActivityStep = WaitStep | TransactionStep;

export const isWaitStep = (x: ActivityStep): x is WaitStep => {
  return typeof (x as WaitStep).duration === "number";
};

export const isWaitStepInProgress = (x: WaitStep): x is WaitStepInProgress => {
  return typeof (x as WaitStepInProgress).startedAt === "number";
};

export const isWaitStepDone = (x: WaitStep): x is WaitStepDone => {
  return (x as WaitStepDone).done === true;
};

/**
 * Buttons are always dependent on some wait period elapsing.
 */
export const isButtonEnabled = (
  timestamp: number | undefined,
  duration: number
) => {
  if (!timestamp) return false;
  return timestamp + duration < Date.now();
};

export const buildWaitStep = (
  start: number | undefined,
  end: number | undefined,
  duration: number,
  done?: boolean
): WaitStep => {
  if (done) {
    const a: WaitStepDone = { duration, done: true };
    return a;
  }

  if (!start) {
    const a: WaitStepNotStarted = { duration };
    return a;
  }

  if (start && end) {
    const a: WaitStepDone = { duration, done: true };
    return a;
  }

  if (start + duration < Date.now()) {
    const a: WaitStepDone = { duration, done: true };
    return a;
  }

  const a: WaitStepInProgress = { duration, startedAt: start };
  return a;
};
