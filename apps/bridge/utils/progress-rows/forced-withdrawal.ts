import {
  ArbitrumForcedWithdrawalDto,
  ForcedWithdrawalDto,
} from "@/codegen/model";

import { ExpandedItem, ProgressRowStatus } from "./common";
import { depositProgressRows } from "./deposit";
import { withdrawalProgressRows } from "./withdrawal";
import { arbitrumWithdrawalProgressRows } from "./arbitrum-withdrawal";
import { arbitrumDepositProgressRows } from "./arbitrum-deposit";

export const optimismForcedWithdrawalProgressRows = (
  fw: ForcedWithdrawalDto,
  pendingProves: { [id: string]: string | undefined },
  pendingFinalises: { [id: string]: string | undefined }
): ExpandedItem[] => {
  let depositRows = depositProgressRows(fw.deposit);
  let withdrawalRows = withdrawalProgressRows(
    fw.withdrawal,
    pendingProves,
    pendingFinalises
  );

  if (depositRows[0].status === ProgressRowStatus.InProgress) {
    depositRows[0].label = "Withdrawing on L1";
  } else {
    depositRows[0].label = "Withdrawn on L1";
  }

  // duplicated "Waiting for L2" and "Withdrawn" items here
  // need to figure out which to remove
  if (depositRows[1].status === ProgressRowStatus.Done) {
    depositRows = depositRows.slice(0, 1);
    withdrawalRows[0].label = "Withdrawn on L2";
  } else {
    withdrawalRows = withdrawalRows.slice(1);
  }

  return [...depositRows, ...withdrawalRows];
};

export const arbitrumForcedWithdrawalProgressRows = (
  fw: ArbitrumForcedWithdrawalDto,
  pendingFinalises: { [id: string]: string | undefined }
): ExpandedItem[] => {
  let depositRows = arbitrumDepositProgressRows(fw.deposit);
  let withdrawalRows = arbitrumWithdrawalProgressRows(
    fw.withdrawal,
    pendingFinalises
  );

  if (depositRows[0].status === ProgressRowStatus.InProgress) {
    depositRows[0].label = "Withdrawing on L1";
  } else {
    depositRows[0].label = "Withdrawn on L1";
  }

  // duplicated "Waiting for L2" and "Withdrawn" items here
  // need to figure out which to remove
  if (depositRows[1].status === ProgressRowStatus.Done) {
    depositRows = depositRows.slice(0, 1);
    withdrawalRows[0].label = "Withdrawn on L2";
  } else {
    withdrawalRows = withdrawalRows.slice(1);
  }

  return [...depositRows, ...withdrawalRows];
};
