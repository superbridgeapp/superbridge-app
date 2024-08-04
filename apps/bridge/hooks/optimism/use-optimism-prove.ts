import { useBridgeControllerGetProveTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";

import { useDeploymentById } from "../deployments/use-deployment-by-id";
import { useFaultProofUpgradeTime } from "../use-fault-proof-upgrade-time";
import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useProveOptimism({
  id,
  deploymentId,
  withdrawal,
}: BridgeWithdrawalDto) {
  const deployment = useDeploymentById(deploymentId);
  const setProving = usePendingTransactions.useSetProving();
  const setBlockProvingModal = useConfigState.useSetBlockProvingModal();
  const getProveTransaction = useBridgeControllerGetProveTransaction();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const { loading, onSubmit } = useSendTransactionDto(deployment?.l1, () =>
    getProveTransaction.mutateAsync({
      data: { id },
    })
  );

  const onProve = async () => {
    if (faultProofUpgradeTime) {
      setBlockProvingModal(deployment);
      return;
    }

    const hash = await onSubmit();
    if (hash) {
      trackEvent({
        event: "prove-withdrawal",
        network: deployment?.l1.name ?? "",
        originNetwork: deployment?.l2.name ?? "",
        withdrawalTransactionHash: withdrawal.transactionHash,
      });
      setProving(id, hash);
    }
  };

  return {
    onProve,
    loading,
  };
}
