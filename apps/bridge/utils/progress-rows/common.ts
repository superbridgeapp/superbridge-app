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

export interface ExpandedItem {
  label: string;
  status: ProgressRowStatus;
  link?: string;
  time?: string;
  buttonComponent?: ButtonComponent;
}
