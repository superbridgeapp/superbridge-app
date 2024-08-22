import { TransactionStatus } from "@/codegen/model";
import { useFinalisingTx } from "@/hooks/activity/use-finalising-tx";
import { useInitiatingTx } from "@/hooks/activity/use-initiating-tx";
import { useProveTx } from "@/hooks/activity/use-prove-tx";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { useTxProvider } from "@/hooks/activity/use-tx-provider";
import { useTxToken } from "@/hooks/activity/use-tx-token";
import { useModal } from "@/hooks/use-modal";
import { useTransactions } from "@/hooks/use-transactions";
import { usePendingTransactions } from "@/state/pending-txs";
import { getInitiatingHash } from "@/utils/initiating-tx-hash";
import { useProgressRows } from "@/utils/progress-rows";
import { isWaitStep } from "@/utils/progress-rows/common";

import { NetworkIcon } from "../network-icon";
import { RouteProviderName } from "../route-provider-icon";
import { TokenIcon } from "../token-icon";
import { LineItem } from "../transaction-line-item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const useTransactionByInitiatingHash = (hash: string | null) => {
  const { transactions } = useTransactions();
  const pendingTransactions = usePendingTransactions.useTransactions();
  return (
    transactions.find((x) => getInitiatingHash(x) === hash) ||
    pendingTransactions.find((x) => getInitiatingHash(x) === hash)
  );
};

const Content = () => {
  const modal = useModal("TransactionDetails");
  const tx = useTransactionByInitiatingHash(modal.data);

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
    <div>
      <DialogHeader className="items-center pt-10">
        <TokenIcon token={token} className="h-14 w-14 mb-2" />
        <DialogTitle className="text-3xl text-center">
          {isSuccess ? `Bridged ${amount}` : `Bridging ${amount}`}
        </DialogTitle>
        <DialogDescription>
          <div className="flex gap-1 items-center rounded-sm border pl-1 pr-2 py-1">
            <div className="flex">
              <NetworkIcon
                chain={chains?.from}
                className="w-4 h-4 rounded-2xs"
              />
              <NetworkIcon
                chain={chains?.to}
                className="w-4 h-4 -ml-1 rounded-2xs"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              via <RouteProviderName provider={provider} />
            </span>
            {/* <RouteProviderIcon provider={provider} /> */}
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col p-6 pt-0 gap-1">
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
  const modal = useModal("TransactionDetails");

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <Content />
      </DialogContent>
    </Dialog>
  );
};
