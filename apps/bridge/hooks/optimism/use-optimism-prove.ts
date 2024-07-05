import { Chain } from "viem";

import { useBridgeControllerGetProveTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";

import { useFaultProofUpgradeTime } from "../use-fault-proof-upgrade-time";
import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useProveOptimism({ id, deployment }: BridgeWithdrawalDto) {
  const setProving = usePendingTransactions.useSetProving();
  const setBlockProvingModal = useConfigState.useSetBlockProvingModal();
  const getProveTransaction = useBridgeControllerGetProveTransaction();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const { loading, onSubmit } = useSendTransactionDto(deployment.l1, () =>
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
      setProving(id, hash);
    }
  };

  return {
    onProve,
    loading,
  };
}
