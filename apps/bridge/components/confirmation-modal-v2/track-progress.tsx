import Link from "next/link";

import { useCancelBridge } from "@/hooks/bridge/use-cancel-bridge";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";
import { useExplorerLink } from "@/utils/transaction-link";

import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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
    <>
      <DialogHeader className="items-center">
        <DialogTitle className="text-3xl">Bridging</DialogTitle>
        <DialogDescription>
          Bridging {rawAmount} {token?.symbol} from {from?.name} to {to?.name}
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 px-6">
        <p>Next steps</p>
      </div>

      <DialogFooter>
        <Link
          href="/support"
          className="text-xs font-heading text-center hover:underline"
        >
          Need help? View the FAQs
        </Link>
        <div className="flex flex-row gap-2 w-full">
          <Button asChild variant={"secondary"} className="w-full">
            <a href={explorerLink.link} target="_blank">
              {explorerLink.name}
            </a>
          </Button>

          <Button
            className="w-full"
            onClick={() => {
              cancel();
              setDisplayTransactions(true);
            }}
          >
            Track activity
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};
