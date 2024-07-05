import { useBridgeControllerGetFinaliseTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useFinaliseOptimism({ id, deployment }: BridgeWithdrawalDto) {
  const setFinalising = usePendingTransactions.useSetFinalising();
  const getFinaliseTransaction = useBridgeControllerGetFinaliseTransaction();

  const { loading, onSubmit } = useSendTransactionDto(deployment.l1, () =>
    getFinaliseTransaction.mutateAsync({
      data: { id },
    })
  );

  const onFinalise = async () => {
    const hash = await onSubmit();
    if (hash) {
      // rainbow just returns null if cancelled
      setFinalising(id, hash);
    }
  };

  return {
    onFinalise,
    loading,
  };
}
