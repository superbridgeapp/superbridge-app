import { TransactionStatus } from "@/codegen/model";
import { useFinalisingTx } from "@/hooks/activity/use-finalising-tx";
import { useInitiatingTx } from "@/hooks/activity/use-initiating-tx";
import { useProveTx } from "@/hooks/activity/use-prove-tx";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { useTxProvider } from "@/hooks/activity/use-tx-provider";
import { useTxToken } from "@/hooks/activity/use-tx-token";
import { useTransactions } from "@/hooks/use-transactions";
import { useModalsState } from "@/state/modals";
import { useProgressRows } from "@/utils/progress-rows";
import { isWaitStep } from "@/utils/progress-rows/common";

import { NetworkIcon } from "../network-icon";
import { RouteProviderIcon } from "../route-provider-icon";
import { TokenIcon } from "../token-icon";
import { LineItem } from "../transaction-line-item";
import { Dialog, DialogContent } from "../ui/dialog";

const useTransactionById = (id: string | null) => {
  const { transactions } = useTransactions();
  return transactions.find((x) => x.id === id);
};

const Content = () => {
  const activityId = useModalsState.useActivityId();
  const tx = useTransactionById(activityId);

  const token = useTxToken(tx);

  const amount = useTxAmount(tx, token);
  const provider = useTxProvider(tx);
  const chains = useTxFromTo(tx);

  const initiatingTx = useInitiatingTx(tx);
  const proveTx = useProveTx(tx);
  const finalisingTx = useFinalisingTx(tx);

  const isSuccess = finalisingTx?.status === TransactionStatus.confirmed;
  const rows = useProgressRows(tx ?? null);

  return (
    <div className="">
      <h1 className="text-3xl">
        {isSuccess ? `Bridged ${amount}` : `Bridging ${amount}`}
      </h1>

      <div>Amount: {amount}</div>
      <div className="flex items-center gap-2">
        <span>Token:</span>
        <TokenIcon token={token} className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-2">
        <span>Route:</span>
        <RouteProviderIcon provider={provider} />
      </div>

      <div className="flex items-center gap-2">
        <span>From:</span>
        <NetworkIcon chain={chains?.from} className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-2">
        <span>To:</span>
        <NetworkIcon chain={chains?.to} className="h-4 w-4" />
      </div>

      <div>
        {rows?.map((item) => (
          <LineItem
            key={isWaitStep(item) ? item.duration.toString() : item.label}
            step={item}
            tx={tx!}
          />
        ))}
      </div>
    </div>
  );
};

export const TransactionDetailsModal = () => {
  const setActivityId = useModalsState.useSetActivityId();
  const activityId = useModalsState.useActivityId();

  const onClose = () => setActivityId(null);

  return (
    <Dialog open={!!activityId} onOpenChange={onClose}>
      <DialogContent>
        <Content />
      </DialogContent>
    </Dialog>
  );
};
