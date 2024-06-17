import { useConfigState } from "@/state/config";

import { useCctpArgs } from "./cctp-args/use-cctp-bridge-args";
import { useDepositArgs } from "./deposit-args/use-deposit-args";
import { useWithdrawArgs } from "./withdraw-args/use-withdraw-args";
import { isCctpBridgeOperation } from "./cctp-args/common";
import { forceWithdrawalArgs } from "./force-withdrawal-args";
import { useDeployment } from "../use-deployment";
import { useWeiAmount } from "../use-wei-amount";
import { useAcrossArgs } from "./use-across-args";

export const useTransactionArgs = () => {
  const stateToken = useConfigState.useToken();
  const forceViaL1 = useConfigState.useForceViaL1();
  const withdrawing = useConfigState.useWithdrawing();
  const fast = useConfigState.useFast();

  const wei = useWeiAmount();
  const deployment = useDeployment();
  const deposit = useDepositArgs();
  const withdraw = useWithdrawArgs();
  const cctp = useCctpArgs();
  const across = useAcrossArgs();

  if (!stateToken || !wei) {
    return;
  }

  if (fast) {
    return across;
  }

  if (isCctpBridgeOperation(stateToken)) {
    if (forceViaL1) return forceWithdrawalArgs(cctp, deployment);
    return cctp;
  }

  if (withdrawing) {
    if (forceViaL1) return forceWithdrawalArgs(withdraw, deployment);
    return withdraw;
  }

  return deposit;
};
