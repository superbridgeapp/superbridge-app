import { Dispatch, SetStateAction } from "react";

export enum SupportCheckStatus {
  Loading,
  Ok,
  Warning,
  Error,
}

export type StatusCheckProps = {
  setSupportChecks: Dispatch<
    SetStateAction<{
      [name: string]: SupportCheckStatus;
    }>
  >;
};
