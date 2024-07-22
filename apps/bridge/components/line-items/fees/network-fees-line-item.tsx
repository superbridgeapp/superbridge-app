import { useIsWithdrawal } from "@/hooks/use-withdrawing";

import { NetworkFees } from "./network-fees";
import { WithdrawFees } from "./withdraw-fees";

export const NetworkFeesLineItem = () => {
  const withdrawing = useIsWithdrawal();
  return withdrawing ? <WithdrawFees /> : <NetworkFees />;
};
