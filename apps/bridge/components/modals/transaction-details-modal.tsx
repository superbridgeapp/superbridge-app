import { useTranslation } from "react-i18next";

import {
  RouteStepReceiveDto,
  RouteStepTransactionDto,
  RouteStepType,
  RouteStepWaitDto,
} from "@/codegen/model";
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
import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isHyperlaneBridge,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
  isRouteReceiveStep,
  isRouteWaitStep,
  isWithdrawal,
} from "@/utils/guards";

import { NetworkIcon } from "../network-icon";
import { RouteProviderIcon } from "../route-provider-icon";
import { TokenIcon } from "../token-icon";
import { Dialog, DialogContent } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const useTransactionById = (id: string | null) => {
  const { transactions } = useTransactions();
  return transactions.find((x) => x.id === id);
};

const useSteps = (
  tx: Transaction | undefined
): (RouteStepWaitDto | RouteStepReceiveDto | RouteStepTransactionDto)[] => {
  const chains = useTxFromTo(tx);
  if (!chains || !tx) {
    return [];
  }

  const { from, to } = chains;

  if (isAcrossBridge(tx)) {
    return [
      {
        type: RouteStepType.Initiate,
        chainId: from.id.toString(),
        estimatedGasLimit: 100_000,
      },
      {
        type: RouteStepType.Receive,
        chainId: to.id.toString(),
      },
    ];
  }

  if (isHyperlaneBridge(tx)) {
    return [
      {
        type: RouteStepType.Initiate,
        chainId: from.id.toString(),
        estimatedGasLimit: 100_000,
      },
      {
        type: RouteStepType.Receive,
        chainId: to.id.toString(),
        estimatedGasLimit: 100_000,
      },
    ];
  }

  if (isCctpBridge(tx)) {
    return [
      {
        type: RouteStepType.Initiate,
        chainId: from.id.toString(),
        estimatedGasLimit: 100_000,
      },
      {
        type: RouteStepType.Mint,
        chainId: to.id.toString(),
        estimatedGasLimit: 100_000,
      },
    ];
  }

  if (isDeposit(tx)) {
    return [
      {
        type: RouteStepType.Initiate,
        chainId: from.id.toString(),
        estimatedGasLimit: 100_000,
      },
      {
        type: RouteStepType.Wait,
        duration: 1000,
      },
      {
        type: RouteStepType.Mint,
        chainId: to.id.toString(),
        estimatedGasLimit: 100_000,
      },
    ];
  }

  if (isWithdrawal(tx)) {
    return [
      {
        type: RouteStepType.Initiate,
        chainId: from.id.toString(),
        estimatedGasLimit: 100_000,
      },
      {
        type: RouteStepType.Wait,
        duration: isOptimismWithdrawal(tx) ? tx.proveDuration : tx.duration,
      },
      ...(isOptimismWithdrawal(tx)
        ? [
            {
              type: RouteStepType.Prove,
              chainId: to.id.toString(),
              estimatedGasLimit: 100_000,
            },
            {
              type: RouteStepType.Wait,
              duration: tx.finalizeDuration,
            },
          ]
        : []),
      {
        type: RouteStepType.Finalize,
        chainId: to.id.toString(),
        estimatedGasLimit: 100_000,
      },
    ];
  }

  if (isOptimismForcedWithdrawal(tx)) {
    return [
      {
        type: RouteStepType.Initiate,
        chainId: to.id.toString(),
        estimatedGasLimit: 100_000,
      },
      {
        type: RouteStepType.Wait,
        duration: 1000 + 1000,
      },
      {
        type: RouteStepType.Prove,
        chainId: to.id.toString(),
        estimatedGasLimit: 100_000,
      },
      {
        type: RouteStepType.Wait,
        duration: 1000,
      },
      {
        type: RouteStepType.Finalize,
        chainId: to.id.toString(),
        estimatedGasLimit: 100_000,
      },
    ];
  }

  return [];
};

const WaitStep = ({
  tx,
  step,
}: {
  tx: Transaction;
  step: RouteStepWaitDto;
}) => {};

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

  const steps = useSteps(tx);

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
        <div>Steps</div>

        {steps.map((step) => (
          <div key={step.type}>
            {isRouteWaitStep(step) ? (
              <div>{step.type}</div>
            ) : isRouteReceiveStep(step) ? (
              <div>{step.type}</div>
            ) : (
              <div>Transaction</div>
            )}
          </div>
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
