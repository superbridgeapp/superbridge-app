import { useAcrossDomains } from "@/hooks/use-across-domains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useFastState } from "@/state/fast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FastNetworkIcon } from "./network-icon";

export const FastFromTo = () => {
  const from = useFromChain();
  const to = useToChain();
  const domains = useAcrossDomains();
  const setFromChainId = useFastState.useSetFromChainId();
  const setToChainId = useFastState.useSetToChainId();

  return (
    <div
      className={`border box-border relative flex items-start justify-between box-border p-3 py-4  rounded-[16px] relative`}
    >
      <div className="grow flex gap-2 items-start w-1/2 pr-3">
        <FastNetworkIcon
          chain={from}
          width={32}
          height={32}
          className="pointer-events-none"
        />

        <DropdownMenu>
          <DropdownMenuTrigger>{from?.name}</DropdownMenuTrigger>
          <DropdownMenuContent>
            {domains.map((d) => (
              <DropdownMenuItem
                key={`fast-${d.chain.name}`}
                onClick={() => {
                  setFromChainId(d.chain.id);
                  if (d.chain.id === to?.id) {
                    setToChainId(from!.id);
                  }
                }}
              >
                {d.chain?.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <button
        onClick={() => {
          if (!from || !to) return;
          setToChainId(from.id);
          setFromChainId(to.id);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 256 256"
          className={`fill-muted-foreground absolute left-[50%] top-1/2 w-6 h-6 -translate-x-[50%] -translate-y-2/4 transparent`}
        >
          <path d="M224.49 136.49l-72 72a12 12 0 01-17-17L187 140H40a12 12 0 010-24h147l-51.49-51.52a12 12 0 0117-17l72 72a12 12 0 01-.02 17.01z"></path>
        </svg>
      </button>

      <div className="grow flex gap-2 items-start justify-end w-1/2 pr-3">
        <DropdownMenu>
          <DropdownMenuTrigger>{to?.name}</DropdownMenuTrigger>
          <DropdownMenuContent>
            {domains.map((d) => (
              <DropdownMenuItem
                key={`fast-${d.chain.name}`}
                onClick={() => {
                  setToChainId(d.chain.id);
                  if (d.chain.id === from?.id) {
                    setFromChainId(to!.id);
                  }
                }}
              >
                {d.chain?.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <FastNetworkIcon
          chain={to}
          width={32}
          height={32}
          className="pointer-events-none"
        />
      </div>
    </div>
  );
};
