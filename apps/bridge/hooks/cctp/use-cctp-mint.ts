import { useBridgeControllerGetCctpMintTransactionV2 } from "@/codegen";
import { CctpBridgeDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useMintCctp({ id, to }: CctpBridgeDto) {
  const setFinalising = usePendingTransactions.useSetFinalising();
  const finaliseTransaction = useBridgeControllerGetCctpMintTransactionV2();

  const { loading, onSubmit } = useSendTransactionDto(to, () =>
    finaliseTransaction.mutateAsync({ data: { id } })
  );

  const write = async () => {
    const hash = await onSubmit();
    if (hash) {
      // rainbow just returns null if cancelled
      setFinalising(id, hash);
    }
  };

  return {
    write,
    loading,
  };
}
