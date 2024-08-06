import { useBridgeControllerGetCctpMintTransactionV2 } from "@/codegen";
import { CctpBridgeDto } from "@/codegen/model";
import { useTrackEvent } from "@/services/ga";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSendTransactionDto } from "../use-send-transaction-dto";

export function useMintCctp({ id, to, from, bridge }: CctpBridgeDto) {
  const setFinalising = usePendingTransactions.useSetFinalising();
  const finaliseTransaction = useBridgeControllerGetCctpMintTransactionV2();
  const trackEvent = useTrackEvent();

  const { loading, onSubmit } = useSendTransactionDto(to, () =>
    finaliseTransaction.mutateAsync({ data: { id } })
  );

  const write = async () => {
    const hash = await onSubmit();
    if (hash) {
      trackEvent({
        event: "cctp-mint",
        burnNetwork: from.name,
        network: to.name,
        burnTransactionHash: bridge.transactionHash,
      });
      setFinalising(id, hash);
    }
  };

  return {
    write,
    loading,
  };
}
