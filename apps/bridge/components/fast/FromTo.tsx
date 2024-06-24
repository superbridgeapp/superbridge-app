import { useAcrossDomains } from "@/hooks/use-across-domains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useFastState } from "@/state/fast";

import { FastNetworkIcon } from "./network-icon";
import { useConfigState } from "@/state/config";
import { useTranslation } from "react-i18next";

export const FastFromTo = () => {
  const from = useFromChain();
  const to = useToChain();
  const setFromChainId = useFastState.useSetFromChainId();
  const setToChainId = useFastState.useSetToChainId();
  const setNetworkSelectorModal = useConfigState.useSetNetworkSelectorModal();
  const { t } = useTranslation();
  return (
    <div
      className={`relative flex items-start justify-between gap-1 select-none`}
    >
      <div
        className="flex gap-2 w-full items-start justify-start bg-muted px-3.5 pt-3 pb-2.5 rounded-lg transition-all hover:scale-[1.02] origin-right cursor-pointer"
        onClick={() => setNetworkSelectorModal("from")}
      >
        <FastNetworkIcon
          chain={from}
          width={32}
          height={32}
          className="pointer-events-none"
        />
        <div>
          <span
            className={`text-muted-foreground text-xs leading-none block mt-0.5`}
          >
            {t("from")}
          </span>
          <span>{from?.name}</span>
        </div>
      </div>

      <button
        onClick={() => {
          if (!from || !to) return;
          setToChainId(from.id);
          setFromChainId(to.id);
        }}
        className="backdrop-blur-3xl bg-card rounded-lg p-0.5 absolute left-[50%] top-1/2 -translate-x-[50%] -translate-y-2/4 z-10 transition-all hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 256 256"
          className={`fill-muted-foreground w-6 h-6 p-1 bg-muted rounded-md`}
        >
          <path d="M224.49 136.49l-72 72a12 12 0 01-17-17L187 140H40a12 12 0 010-24h147l-51.49-51.52a12 12 0 0117-17l72 72a12 12 0 01-.02 17.01z"></path>
        </svg>
      </button>

      <div
        className="flex gap-2 w-full items-start justify-end bg-muted px-3.5 pt-3 pb-2.5 rounded-lg transition-all origin-left hover:scale-[1.02] cursor-pointer"
        onClick={() => setNetworkSelectorModal("to")}
      >
        <div className="text-right">
          <span
            className={`text-muted-foreground text-xs leading-none block mt-0.5`}
          >
            {t("to")}
          </span>
          <span>{to?.name}</span>
        </div>

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
