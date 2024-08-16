import { useBridgeControllerGetProveTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { useTrackEvent } from "@/services/ga";
import { usePendingTransactions } from "@/state/pending-txs";

import { useDeploymentById } from "../deployments/use-deployment-by-id";
import { useFaultProofUpgradeTime } from "../use-fault-proof-upgrade-time";
import { useModal } from "../use-modal";
import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useProveOptimism({
  id,
  deploymentId,
  withdrawal,
}: BridgeWithdrawalDto) {
  const deployment = useDeploymentById(deploymentId);
  const setProving = usePendingTransactions.useSetProving();
  const blockProvingModal = useModal("BlockProving");
  const getProveTransaction = useBridgeControllerGetProveTransaction();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const { loading, onSubmit } = useSendTransactionDto(deployment?.l1, () =>
    getProveTransaction.mutateAsync({
      data: { id },
    })
  );
  const trackEvent = useTrackEvent();

  const onProve = async () => {
    if (faultProofUpgradeTime) {
      blockProvingModal.open(deployment?.id);
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
