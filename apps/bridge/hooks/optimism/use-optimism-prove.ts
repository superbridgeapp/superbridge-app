import { useBridgeControllerGetProveTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { useTrackEvent } from "@/services/ga";
import { usePendingTransactions } from "@/state/pending-txs";

import { useDeploymentById } from "../deployments/use-deployment-by-id";
import { useFaultProofUpgradeTime } from "../use-fault-proof-upgrade-time";
import { useModal } from "../use-modal";
import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useProveOptimism(w: BridgeWithdrawalDto | undefined) {
  const deployment = useDeploymentById(w?.deploymentId);
  const setProving = usePendingTransactions.useSetProving();
  const blockProvingModal = useModal("BlockProving");
  const getProveTransaction = useBridgeControllerGetProveTransaction();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const { loading, onSubmit } = useSendTransactionDto(deployment?.l1, () => {
    if (!w) throw new Error();
    return getProveTransaction.mutateAsync({
      data: { id: w.id },
    });
  });
  const trackEvent = useTrackEvent();

  const onProve = async () => {
    if (!w) {
      return;
    }

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
        withdrawalTransactionHash: w.withdrawal.transactionHash,
      });
      setProving(w.id, hash);
    }
  };

  return {
    onProve,
    loading,
  };
}
