import { useCancelBridge } from "@/hooks/bridge/use-cancel-bridge";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";
import { useExplorerLink } from "@/utils/transaction-link";

import { Button } from "../ui/button";

export const TrackBridgeProgress = () => {
  const rawAmount = useConfigState.useRawAmount();
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();
  const hash = useModalsState.usePendingBridgeTransactionHash();

  const from = useFromChain();
  const to = useToChain();
  const token = useSelectedToken();
  const explorerLink = useExplorerLink("tx", hash || "0x", from);
  const cancel = useCancelBridge();

  return (
    <div>
      <div>
        <h1>Bridging</h1>
        <p>
          Bridging {rawAmount} {token?.symbol} from {from?.name} to {to?.name}
        </p>
      </div>

      <h2>Next steps</h2>

      <div className="flex items-center">
        <Button asChild variant={"secondary"}>
          <a href={explorerLink.link} target="_blank">
            {explorerLink.name}
          </a>
        </Button>

        <Button
          onClick={() => {
            cancel();
            setDisplayTransactions(true);
          }}
        >
          Track activity
        </Button>
      </div>
    </div>
  );
};
