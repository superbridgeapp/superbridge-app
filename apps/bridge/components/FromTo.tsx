import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useChains } from "@/hooks/use-chains";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

import { IconCaretRight } from "./icons";
import { NetworkIcon } from "./network-icon";

export const FromTo = () => {
  const chains = useChains();
  const from = useFromChain();
  const to = useToChain();
  const setFromChainId = useInjectedStore((s) => s.setFromChainId);
  const setToChainId = useInjectedStore((s) => s.setToChainId);
  const setNetworkSelector = useConfigState.useSetNetworkSelector();
  const { t } = useTranslation();

  const networkSelectorEnabled = chains.length > 2;
  return (
    <div className={`relative flex justify-between gap-1 select-none`}>
      <div
        className={clsx(
          "flex gap-2 w-full items-start justify-start bg-muted px-3.5 py-3.5 rounded-lg transition-all origin-right grow-1",
          networkSelectorEnabled && "cursor-pointer hover:scale-[1.02]"
        )}
        onClick={
          networkSelectorEnabled ? () => setNetworkSelector("from") : undefined
        }
      >
        <NetworkIcon
          chain={from}
          width={32}
          height={32}
          className="pointer-events-none"
        />
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-muted-foreground text-xs leading-none block mt-0.5`}
          >
            {t("from")}
          </span>
          <span className="leading-none">{from?.name}</span>
        </div>
      </div>
      <button
        onClick={() => {
          if (!from || !to) return;
          setToChainId(from.id);
          setFromChainId(to.id);

          trackEvent({ event: "from-chain-select", name: to.name });
          trackEvent({ event: "to-chain-select", name: from.name });
        }}
        className="rounded-md bg-card border-2 bg-clip-border border-card absolute left-[50%] top-1/2 -translate-x-[50%] -translate-y-2/4 z-10 transition-all hover:scale-105 overflow-hidden"
      >
        <div className="before:backdrop-blur-sm before:absolute before:inset-0 before:-z-10">
          <div className="p-1 bg-muted backdrop-blur-sm">
            <IconCaretRight className={`w-3.5 h-3.5 fill-muted-foreground`} />
          </div>
        </div>
      </button>
      <div
        className={clsx(
          "flex gap-2 w-full items-start justify-end bg-muted px-3.5 py-3.5 rounded-lg transition-all origin-left",
          networkSelectorEnabled && "cursor-pointer hover:scale-[1.02]"
        )}
        onClick={
          networkSelectorEnabled ? () => setNetworkSelector("to") : undefined
        }
      >
        <div className="flex flex-col gap-0.5 text-right">
          <span
            className={`text-muted-foreground text-xs leading-none block mt-0.5`}
          >
            {t("to")}
          </span>
          <span className="leading-none">{to?.name}</span>
        </div>

        <NetworkIcon
          chain={to}
          width={32}
          height={32}
          className="pointer-events-none"
        />
      </div>
    </div>
  );
};
