import { useConfigState } from "@/state/config";
import { isCctp } from "@/utils/is-cctp";

import { useTokenBalance } from "../use-balances";
import { useDeployment } from "../use-deployment";
import { useSelectedToken } from "../use-selected-token";
import { useWeiAmount } from "../use-wei-amount";
import { useIsWithdrawal } from "../use-withdrawing";
import { useCctpArgs } from "./cctp-args/use-cctp-bridge-args";
import { useDepositArgs } from "./deposit-args/use-deposit-args";
import { forceWithdrawalArgs } from "./force-withdrawal-args";
import { useWithdrawArgs } from "./withdraw-args/use-withdraw-args";

export const useTransactionArgs = () => {
  const stateToken = useConfigState.useToken();
  const forceViaL1 = useConfigState.useForceViaL1();
  const withdrawing = useIsWithdrawal();
  const tokenBalance = useTokenBalance(useSelectedToken());

  const wei = useWeiAmount();
  const deployment = useDeployment();
  const deposit = useDepositArgs();
  const withdraw = useWithdrawArgs();
  const cctp = useCctpArgs();

  if (!stateToken || !wei || wei > tokenBalance) {
    return;
  }

  if (isCctp(stateToken)) {
    if (forceViaL1) return forceWithdrawalArgs(cctp, deployment);
    return cctp;
  }

  if (withdrawing) {
    if (forceViaL1) return forceWithdrawalArgs(withdraw, deployment);
    return withdraw;
  }

  return deposit;
};
