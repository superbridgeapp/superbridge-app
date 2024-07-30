import { ChainDto } from "@/codegen/model";

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

export interface TransactionStep {
  label: string;
  // status: ProgressRowStatus;
  link?: string;
  fee?: string;
  chain: ChainDto | null;
  buttonComponent?: JSX.Element;
}

export type WaitStepInProgress = {
  startedAt: number;
  duration: number;
};
export type WaitStepNotStarted = {
  duration: number;
};

export type WaitStep = WaitStepInProgress | WaitStepNotStarted;

export type ActivityStep = WaitStep | TransactionStep;

export const isWaitStep = (x: ActivityStep): x is WaitStep => {
  return (
    typeof (x as WaitStepInProgress).startedAt === "number" ||
    typeof (x as WaitStepNotStarted).duration === "number"
  );
};

export const isWaitStepInProgress = (x: WaitStep): x is WaitStepInProgress => {
  return typeof (x as WaitStepInProgress).startedAt === "number";
};
