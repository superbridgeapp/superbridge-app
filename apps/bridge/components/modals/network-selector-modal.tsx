import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";

import { ChainDto } from "@/codegen/model";
import { cardThemes } from "@/config/card-themes";
import { useSortedChains } from "@/hooks/network-selector/sort";
import { usePossibleFromChains } from "@/hooks/network-selector/use-possible-from-chains";
import { useGetPossibleToChains } from "@/hooks/network-selector/use-possible-to-chains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useTrackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

import { IconClose } from "../icons";
import { NetworkIcon } from "../network-icon";

// Animations
const container = {
  hidden: {
    y: "5vh",
    opacity: 0,
    transition: {
      type: "easeIn",
      duration: 0.15,
    },
  },
  show: {
    opacity: 1,
    y: "0vh",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 16,
      staggerChildren: 0.05,
      delayChildren: 0.1,
      // staggerDirection: -1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
    },
  },
};

const PlacehoderItem = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 0.2,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 12,
    },
  },
};

export const NetworkSelector = () => {
  const to = useToChain();
  const from = useFromChain();
  const trackEvent = useTrackEvent();

  const networkSelectorDirection = useConfigState.useNetworkSelectorDirection();
  const setDisplayNetworkSelector =
    useConfigState.useSetDisplayNetworkSelector();
  const setFromChainId = useInjectedStore((s) => s.setFromChainId);
  const toChainId = useInjectedStore((s) => s.toChainId);
  const setToChainId = useInjectedStore((s) => s.setToChainId);

  const possibleFrom = usePossibleFromChains();
  const getPossibleTo = useGetPossibleToChains();

  const availableChains = useSortedChains(
    networkSelectorDirection === "from" ? possibleFrom : getPossibleTo(from)
  );

  const onSelect = (chain: ChainDto) => {
    if (networkSelectorDirection === "from") {
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

    if (networkSelectorDirection === "to") {
      trackEvent({ event: "to-chain-select", name: chain.name });

      setToChainId(chain.id);

      // invert
      if (chain.id === from?.id) {
        trackEvent({ event: "from-chain-select", name: to!.name });
        setFromChainId(to!.id);
      }
    }

    setDisplayNetworkSelector(false);
  };

  return (
    <main
      className="flex items-start justify-center scroll-smooth overflow-y-scroll w-screen h-dvh fixed inset-0 px-2 md:px-0 py-16 md:py-20 z-[25]"
      key="bridgeMain"
      onClick={() => setDisplayNetworkSelector(false)}
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.1 }}
        whileHover={{ scale: 1.1 }}
        key="close-activity-button"
        className={`flex items-center cursor-pointer w-10 h-10 shrink-0 flex items-center justify-center rounded-full shadow-sm bg-card fixed top-6 right-6 z-10`}
      >
        <IconClose className="fill-foreground w-3.5 h-3.5" />
      </motion.button>
      <motion.div
        variants={container}
        initial={"hidden"}
        animate={"show"}
        exit={"hidden"}
        className="flex flex-col items-center gap-10 w-full"
      >
        <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-full shadow-sm">
          <h1 className="text-2xl font-heading">Select a network</h1>
          {/* <IconArrowUpCircle className="w-6 h-6 fill-muted-foreground" /> */}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full px-4 max-w-3xl">
          {availableChains.map((chain) => {
            return (
              <motion.div
                key={`chain-${chain.id}`}
                onClick={() => onSelect(chain)}
                variants={item}
                // hovers must not be a variant or stagger animation fails
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 1 }}
                className={clsx(
                  "relative w-full  aspect-[3.25/4] shrink-0 flex flex-col shrink-0 cursor-pointer overflow-hidden rounded-2xl shadow-sm",
                  cardThemes[chain.id]?.card.className
                )}
              >
                {/* overlay */}
                {cardThemes[chain.id]?.card.overlay?.image ? (
                  <img
                    src={cardThemes[chain.id]?.card.overlay?.image}
                    className={clsx(
                      "inset-0 z-0 absolute",
                      cardThemes[chain.id]?.card.overlay?.className
                    )}
                    alt={chain.name}
                    // fill
                    loading="eager"
                    sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  />
                ) : (
                  <div
                    className={clsx(
                      "inset-0 z-0 absolute",
                      cardThemes[chain.id]?.card.overlay?.className
                    )}
                  />
                )}
                <div className="flex gap-4 flex-col capitalize items-center justify-center px-3 md:px-6 grow w-full relative z-10">
                  {cardThemes[chain.id]?.icon ? (
                    <Image
                      alt={chain.name}
                      src={cardThemes[chain.id]?.icon!}
                      width={96}
                      height={96}
                      className="pointer-events-none w-16 h-16 md:w-20 md:h-20"
                    />
                  ) : (
                    <NetworkIcon
                      chain={chain}
                      width={96}
                      height={96}
                      className="pointer-events-none w-16 h-16 md:w-24 md:h-24"
                    />
                  )}
                  <h3
                    className={clsx(
                      `text-xs md:text-sm text-center font-heading`,
                      cardThemes[chain.id]?.card.title
                    )}
                  >
                    {chain.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
          {availableChains.length < 4 &&
            [...Array(4 - availableChains.length)].map((e, i) => {
              return (
                <motion.div
                  variants={PlacehoderItem}
                  className="bg-card border relative w-full aspect-[3.25/4] rounded-2xl shadow-sm"
                  key={i}
                ></motion.div>
              );
            })}
        </div>
      </motion.div>
    </main>
  );
};
