import { useIsWithdrawal } from "@/hooks/use-withdrawing";

import { AmountReceivedLineItem } from "./amount-received-line-item";
import { FeeLineItem } from "./fee-line-item";
import { NetworkFees } from "./fees/network-fees";
import { WithdrawFees } from "./fees/withdraw-fees";
import { RecipientAddressLineItem } from "./recipient-line-item";
import { RouteLineItem } from "./route-line-item";
import { TransferTimeLineItem } from "./transfer-time-line-item";

export const LineItems = () => {
  const withdrawing = useIsWithdrawal();

  return (
    <div
      className={`border border-border rounded-2xl divide-y divide-border pt-1`}
    >
      <RecipientAddressLineItem />
      <FeeLineItem />
      <AmountReceivedLineItem />
      <RouteLineItem />
      <TransferTimeLineItem />
      {fast || !withdrawing ? <NetworkFees /> : <WithdrawFees />}
    </div>
  );
};
