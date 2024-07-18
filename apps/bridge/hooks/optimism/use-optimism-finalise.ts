import { useBridgeControllerGetFinaliseTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { trackEvent } from "@/services/ga";
import { usePendingTransactions } from "@/state/pending-txs";

import { useDeploymentById } from "../use-deployment-by-id";
import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useFinaliseOptimism({
  id,
  deploymentId,
  withdrawal,
}: BridgeWithdrawalDto) {
  const deployment = useDeploymentById(deploymentId);
  const setFinalising = usePendingTransactions.useSetFinalising();
  const getFinaliseTransaction = useBridgeControllerGetFinaliseTransaction();

  const { loading, onSubmit } = useSendTransactionDto(deployment?.l1, () =>
    getFinaliseTransaction.mutateAsync({
      data: { id },
    })
  );

  const onFinalise = async () => {
    const hash = await onSubmit();
    if (hash) {
      trackEvent({
        event: "finalize-withdrawal",
        network: deployment?.l1.name ?? "",
        originNetwork: deployment?.l2.name ?? "",
        withdrawalTransactionHash: withdrawal.transactionHash,
      });
      setFinalising(id, hash);
    }
  };

  return {
    onFinalise,
    loading,
  };
}
