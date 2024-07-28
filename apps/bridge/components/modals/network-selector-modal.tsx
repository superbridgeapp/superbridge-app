import { motion } from "framer-motion";

import { ChainDto } from "@/codegen/model";
import { usePossibleFromChains } from "@/hooks/network-selector/use-possible-from-chains";
import { useGetPossibleToChains } from "@/hooks/network-selector/use-possible-to-chains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

import { NetworkIcon } from "../network-icon";

export const NetworkSelector = () => {
  const to = useToChain();
  const from = useFromChain();

  const networkSelector = useConfigState.useNetworkSelector();
  const setNetworkSelector = useConfigState.useSetNetworkSelector();
  const setFromChainId = useInjectedStore((s) => s.setFromChainId);
  const toChainId = useInjectedStore((s) => s.toChainId);
  const setToChainId = useInjectedStore((s) => s.setToChainId);

  const possibleFrom = usePossibleFromChains();
  const getPossibleTo = useGetPossibleToChains();

  const availableChains =
    networkSelector === "from" ? possibleFrom : getPossibleTo(from);

  const onSelect = (chain: ChainDto) => {
    if (networkSelector === "from") {
      trackEvent({ event: "from-chain-select", name: chain.name });

      setFromChainId(chain.id);

      // invert
      if (chain.id === to?.id) {
        trackEvent({ event: "to-chain-select", name: from!.name });
        setToChainId(from!.id);
        return;
      }

      // handle case where no routes to toChain
      const nextToChains = getPossibleTo(chain);
      if (!nextToChains.find((x) => x.id === toChainId)) {
        const nextTo = nextToChains.find((x) => x.id !== chain.id);
        if (nextTo) {
          trackEvent({ event: "to-chain-select", name: nextTo.name });
          setToChainId(nextTo.id);
        }
      }
    }

    if (networkSelector === "to") {
      trackEvent({ event: "to-chain-select", name: chain.name });

      setToChainId(chain.id);

      // invert
      if (chain.id === from?.id) {
        trackEvent({ event: "from-chain-select", name: to!.name });
        setFromChainId(to!.id);
      }
    }

    setNetworkSelector(null);
  };

  return (
    <main
      className="flex items-start justify-center w-screen h-screen fixed inset-0 px-2 md:px-0 py-16 pt-[108px] md:py-24 z-[25]"
      key="bridgeMain"
      onClick={() => setNetworkSelector(null)}
    >
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: "0vh" }}
        exit={{ y: "100vh" }}
        transition={{ type: "spring", damping: 12, delay: 0.08 }}
        className="bg-card border flex flex-col self-start  z-50 relative overflow-hidden rounded-[32px] h-[calc(76dvh)] max-h-[680px]  w-screen md:w-[50vw] md:max-w-[420px] aspect-[3/4] backdrop-blur shadow-sm"
      >
        <div className="p-4">Bridge {networkSelector}</div>

        <div className="flex flex-col">
          {availableChains.map((chain) => (
            <div
              key={`chain-${chain.id}`}
              onClick={() => onSelect(chain)}
              className="flex items-center gap-2 px-6 py-4 bg-transparent transition-all hover:bg-muted cursor-pointer"
            >
              <NetworkIcon chain={chain} width={32} height={32} />
              <span className="text-base leading-none">{chain.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
};
