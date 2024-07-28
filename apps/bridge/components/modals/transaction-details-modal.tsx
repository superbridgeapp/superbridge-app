import { useTranslation } from "react-i18next";

import { RouteStepTransactionDto } from "@/codegen/model";
import { useFinalisingTx } from "@/hooks/activity/use-finalising-tx";
import { useInitiatingTx } from "@/hooks/activity/use-initiating-tx";
import { useProveTx } from "@/hooks/activity/use-prove-tx";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { useTxProvider } from "@/hooks/activity/use-tx-provider";
import { useTxToken } from "@/hooks/activity/use-tx-token";
import { useToChain } from "@/hooks/use-chain";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useTransactions } from "@/hooks/use-transactions";
import { useModalsState } from "@/state/modals";
import { useProgressRows } from "@/utils/progress-rows";

import { NetworkIcon } from "../network-icon";
import { RouteProviderIcon } from "../route-provider-icon";
import { TokenIcon } from "../token-icon";
import { TransactionProgressRow } from "../transaction-row";
import { Dialog, DialogContent } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const useTransactionById = (id: string | null) => {
  const { transactions } = useTransactions();
  return transactions.find((x) => x.id === id);
};

type WaitStepNotStarted = {
  type: "wait";
  duration: number;
};
type WaitStepRemaining = {
  type: "wait";
  remaining: number;
};
type WaitStepDone = {
  type: "wait";
  done: true;
};

type TransactionStepNotReady = {
  type: "transaction";
  status: "not-ready";
  id: RouteStepTransactionDto["type"];
  estimatedGasLimit: number;
  chainId: number;
};
type TransactionStepReady = {
  type: "transaction";
  status: "ready";
  id: RouteStepTransactionDto["type"];
  estimatedGasLimit: number;
  chainId: number;
};
type TransactionStepDone = {
  type: "transaction";
  status: "done";
  link: string;
  chainId: number;
};

type ReceiveStepNotDone = {
  type: "receive";
  chainId: number;
};
type ReceiveStepDone = {
  type: "receive";
  chainId: number;
  link: string;
};

type WaitStep = WaitStepNotStarted | WaitStepRemaining | WaitStepDone;
type TransactionStep =
  | TransactionStepNotReady
  | TransactionStepReady
  | TransactionStepDone;
type ReceiveStep = ReceiveStepNotDone | ReceiveStepDone;

type Step = WaitStep | TransactionStep | ReceiveStep;

const TransactionStatus = () => {
  const activityId = useModalsState.useActivityId();
  const tx = useTransactionById(activityId);

  const token = useTxToken(tx);

  const amount = useTxAmount(tx, token);
  const provider = useTxProvider(tx);
  const chains = useTxFromTo(tx);

  const initiatingTx = useInitiatingTx(tx);
  const proveTx = useProveTx(tx);
  const finalisingTx = useFinalisingTx(tx);

  const rows = useProgressRows(tx ?? null);

  return (
    <div className="bg-blue-400">
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
          <TransactionProgressRow key={item.label} item={item} tx={tx!} />
        ))}
      </div>
    </div>
  );
};

const Content = () => {
  const { t } = useTranslation();
  const to = useToChain();
  const token = useSelectedToken();

  const activityId = useModalsState.useActivityId();

  const tx = useTransactionById(activityId);

  return (
    <div className="p-4">
      <Tabs defaultValue="status" className="w-full">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <TransactionStatus />
        </TabsContent>
        <TabsContent value="info">Change your password here.</TabsContent>
      </Tabs>
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
