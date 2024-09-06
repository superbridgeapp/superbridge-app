import { useBridgeControllerGetFinaliseTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { useTrackEvent } from "@/services/ga";
import { usePendingTransactions } from "@/state/pending-txs";

import { useDeploymentById } from "../deployments/use-deployment-by-id";
import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useFinaliseOptimism(w: BridgeWithdrawalDto | undefined) {
  const deployment = useDeploymentById(w?.deploymentId);
  const setFinalising = usePendingTransactions.useSetFinalising();
  const getFinaliseTransaction = useBridgeControllerGetFinaliseTransaction();
  const trackEvent = useTrackEvent();

  const { loading, onSubmit } = useSendTransactionDto(deployment?.l1, () => {
    if (!w) throw new Error("");
    return getFinaliseTransaction.mutateAsync({
      data: { id: w.id },
    });
  });

  const onFinalise = async () => {
    if (!w) return;

    const hash = await onSubmit();
    if (hash) {
      trackEvent({
        event: "finalize-withdrawal",
        network: deployment?.l1.name ?? "",
        originNetwork: deployment?.l2.name ?? "",
        withdrawalTransactionHash: w.withdrawal.transactionHash,
      });
      setFinalising(w.id, hash);
    }
  };

  return {
    onFinalise,
    loading,
  };
}
