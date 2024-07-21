import { AmountReceivedLineItem } from "./amount-received-line-item";
import { FeeLineItem } from "./fee-line-item";
import { NetworkFeesLineItem } from "./fees/network-fees-line-item";
import { RecipientAddressLineItem } from "./recipient-line-item";
import { RouteLineItem } from "./route-line-item";
import { TransferTimeLineItem } from "./transfer-time-line-item";

export const LineItems = () => {
  return (
    <div
      className={`border border-border rounded-2xl divide-y divide-border pt-1`}
    >
      <RecipientAddressLineItem />
      <FeeLineItem />
      <AmountReceivedLineItem />
      <RouteLineItem />
      <TransferTimeLineItem />
      <NetworkFeesLineItem />
    </div>
  );
};
