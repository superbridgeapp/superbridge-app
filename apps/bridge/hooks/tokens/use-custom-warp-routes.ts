import { useMemo } from "react";
import { isPresent } from "ts-is-present";
import * as viemChains from "viem/chains";
import yaml from "yaml";

import { useSettingsState } from "@/state/settings";
import { MultiChainToken, Token } from "@/types/token";

const getViemChain = (str: string) => {
  const chain = Object.entries(viemChains).find(([key]) => key === str)?.[1];
  return chain;
};

export const useCustomWarpRoutes = (): MultiChainToken[] => {
  const savedWarpRoutes = useSettingsState.useCustomWarpRoutes();

  return useMemo(() => {
    const a = yaml.parse(savedWarpRoutes);
    console.log(">>>", a);
    if (!a?.tokens) {
      return [];
    }

    for (const b of a.tokens) {
      const chain = getViemChain(b.chainName);
      if (!chain) {
        continue;
      }

      const bridges = b.connections
        .map((x) => {
          const [, chainName] = x.token.split("|");
          return getViemChain(chainName);
        })
        .filter(isPresent);

      const t: Token = {
        name: b.name,
        symbol: b.symbol,
        logoURI: b.logoURI,
        decimals: b.decimals,
        address: b.addressOrDenom,
        chainId: chain.id,
        bridges,
      };
    }

    return [];
  }, [savedWarpRoutes]);
};
