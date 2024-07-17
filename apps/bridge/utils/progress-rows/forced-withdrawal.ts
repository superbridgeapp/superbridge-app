import {
  ArbitrumForcedWithdrawalDto,
  DeploymentDto,
  ForcedWithdrawalDto,
} from "@/codegen/model";
import { useDeployments } from "@/hooks/use-deployments";

import { useArbitrumDepositProgressRows } from "./arbitrum-deposit";
import { useArbitrumWithdrawalProgressRows } from "./arbitrum-withdrawal";
import { ExpandedItem, ProgressRowStatus } from "./common";
import { useOptimismDepositProgressRows } from "./deposit";
import { useOptimismWithdrawalProgressRows } from "./withdrawal";

export const useOptimismForcedWithdrawalProgressRows = () => {
  const depositRows = useOptimismDepositProgressRows();
  const withdrawalRows = useOptimismWithdrawalProgressRows();
  const { deployments } = useDeployments();

  return (
    fw: ForcedWithdrawalDto,
    deployment: DeploymentDto | null
  ): ExpandedItem[] => {
    if (!deployment) {
      return [];
    }

    let a = depositRows(fw.deposit, deployment);
    let b = withdrawalRows(fw.withdrawal, deployment);
    if (a[0].status === ProgressRowStatus.InProgress) {
      a[0].label = "Withdrawing on L1";
    } else {
      a[0].label = "Withdrawn on L1";
    }

    // duplicated "Waiting for L2" and "Withdrawn" items here
    // need to figure out which to remove
    if (a[1].status === ProgressRowStatus.Done) {
      a = a.slice(0, 1);
      b[0].label = "Withdrawn on L2";
    } else {
      b = b.slice(1);
    }

    return [...a, ...b];
  };
};

export const useArbitrumForcedWithdrawalProgressRows = () => {
  const depositRows = useArbitrumDepositProgressRows();
  const withdrawalRows = useArbitrumWithdrawalProgressRows();

  return (
    fw: ArbitrumForcedWithdrawalDto,
    deployment: DeploymentDto | null
  ): ExpandedItem[] => {
    let a = depositRows(fw.deposit, deployment);
    let b = withdrawalRows(fw.withdrawal, deployment);

    if (a[0].status === ProgressRowStatus.InProgress) {
      a[0].label = "Withdrawing on L1";
    } else {
      a[0].label = "Withdrawn on L1";
    }

    // duplicated "Waiting for L2" and "Withdrawn" items here
    // need to figure out which to remove
    if (a[1].status === ProgressRowStatus.Done) {
      a = a.slice(0, 1);
      b[0].label = "Withdrawn on L2";
    } else {
      b = b.slice(1);
    }

    return [...a, ...b];
  };
};
