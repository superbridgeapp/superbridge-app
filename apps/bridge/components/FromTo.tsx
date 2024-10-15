import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useChains } from "@/hooks/use-chains";
import { useTrackEvent } from "@/services/ga";
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
  const setDisplayNetworkSelector =
    useConfigState.useSetDisplayNetworkSelector();
  const setNetworkSelectorDirection =
    useConfigState.useSetNetworkSelectorDirection();
  const { t } = useTranslation();
  const trackEvent = useTrackEvent();

  const networkSelectorEnabled = chains.length > 2;

  const switchChains = () => {
    if (!from || !to) return;

    setToChainId(from.id);
    setFromChainId(to.id);

    trackEvent({ event: "from-chain-select", name: to.name });
    trackEvent({ event: "to-chain-select", name: from.name });
  };

  const onClick = (dir: "from" | "to") => () => {
    if (networkSelectorEnabled) {
      setNetworkSelectorDirection(dir);
      setDisplayNetworkSelector(true);
    } else {
      switchChains();
    }
  };

  return (
    <div className={`relative flex justify-between gap-1.5 select-none pt-0.5`}>
      <div
        className={clsx(
          "flex gap-2 w-full items-start justify-start bg-muted p-4 rounded-xl transition-all origin-right grow-1",
          "cursor-pointer hover:scale-[1.02]"
        )}
        onClick={onClick("from")}
      >
        <NetworkIcon
          chain={from}
          width={32}
          height={32}
          className="pointer-events-none rounded-sm"
        />
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-muted-foreground text-xs leading-none block mt-0.5`}
          >
            {t("from")}
          </span>
          <span className="leading-none font-button">{from?.name}</span>
        </div>
      </div>
      <button
        onClick={switchChains}
        className="rounded-md bg-card border-2 bg-clip-border border-card absolute left-[50%] top-1/2 -translate-x-[50%] -translate-y-2/4 z-10 transition-all hover:scale-105 overflow-hidden"
      >
        <div className="before:backdrop-blur-sm before:absolute before:inset-0 before:-z-10">
          <div className="p-1 bg-muted backdrop-blur-sm">
            <IconCaretRight className={`w-4 h-4 fill-muted-foreground`} />
          </div>
        </div>
      </button>
      <div
        className={clsx(
          "flex gap-2 w-full items-start justify-end bg-muted p-4 rounded-xl transition-all origin-left",
          "cursor-pointer hover:scale-[1.02]"
        )}
        onClick={onClick("to")}
      >
        <div className="flex flex-col gap-0.5 text-right">
          <span
            className={`text-muted-foreground text-xs leading-none block mt-0.5`}
          >
            {t("to")}
          </span>
          <span className="leading-none  font-button">{to?.name}</span>
        </div>

        <NetworkIcon
          chain={to}
          width={32}
          height={32}
          className="pointer-events-none rounded-sm"
        />
      </div>
    </div>
  );
};
