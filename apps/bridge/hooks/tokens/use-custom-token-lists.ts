import { useQuery } from "@tanstack/react-query";
import { isPresent } from "ts-is-present";
import {
  base,
  baseSepolia,
  lisk,
  liskSepolia,
  mainnet,
  mode,
  modeTestnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "viem/chains";

import { useSettingsState } from "@/state/settings";
import { MultiChainToken } from "@/types/token";
import { SuperchainTokenList } from "@/types/token-lists";

import { useIsSuperbridge } from "../apps/use-is-superbridge";

export const useCustomTokenLists = () => {
  const customTokenLists = useSettingsState.useCustomTokenLists();
  const isSuperbridge = useIsSuperbridge();

  const lists = customTokenLists.filter((x) => x.enabled).map((x) => x.url);
  return useQuery({
    queryKey: lists,
    enabled: isSuperbridge && lists.length > 0,
    queryFn: async () => {
      const responses = await Promise.all(
        lists.map(async (x) => fetch(x).catch(() => null))
      );

      const customTokenListResults: [...(SuperchainTokenList | null)[]] =
        await Promise.all(
          responses
            .filter((x) => x?.status === 200)
            .map((x) => x?.json().catch(() => null))
        );

      return customTokenListResults
        .filter(isPresent)
        .map((result) => {
          const all: Record<string, MultiChainToken> = {};

          for (const t of result.tokens) {
            let multichain = all[t.extensions.opTokenId];
            if (!multichain) {
              multichain = all[t.extensions.opTokenId] = {};
            }

            const mainnetMap: { [key: string]: number | undefined } = {
              optimismBridgeAddress: optimism.id,
              baseBridgeAddress: base.id,
              modeBridgeAddress: mode.id,
              liskBridgeAddress: lisk.id,
            };

            const testnetMap: { [key: string]: number | undefined } = {
              optimismBridgeAddress: optimismSepolia.id,
              baseBridgeAddress: baseSepolia.id,
              modeBridgeAddress: modeTestnet.id,
              liskBridgeAddress: liskSepolia.id,
            };

            const getBridgeableChainId = (chainId: number, key: string) => {
              if (chainId === mainnet.id) return mainnetMap[key];
              if (chainId === sepolia.id) return testnetMap[key];
              return null;
            };

            const bridgeableChainIds = Object.keys(t.extensions)
              .map((name) => getBridgeableChainId(t.chainId, name))
              .filter(isPresent);

            multichain[t.chainId] = {
              address: t.address,
              bridges: bridgeableChainIds,
              chainId: t.chainId,
              decimals: t.decimals,
              logoURI: t.logoURI,
              name: t.name,
              symbol: t.symbol,
            };
          }

          return Object.values(all);
        })
        .flat();
    },
  });
};
