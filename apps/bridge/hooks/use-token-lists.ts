import { useCallback, useEffect } from "react";
import { isPresent } from "ts-is-present";

import { useConfigState } from "@/state/config";
import { CustomTokenList, useSettingsState } from "@/state/settings";
import { MultiChainToken, OptimismToken } from "@/types/token";
import { SuperbridgeTokenList, SuperchainTokenList } from "@/types/token-lists";
import UniswapArbitrumTokenList from "@/utils/token-list/json/arbitrum-uniswap.json";
import ArbArbitrumTokenList from "@/utils/token-list/json/arbitrum.json";
import * as usdc from "@/utils/token-list/json/cctp/usdc";
import MockArbitrumTokenList from "@/utils/token-list/json/mock-arbitrum.json";
import { transformArbitrumTokenList } from "@/utils/token-list/transform-arbitrum-token-list";
import { transformIntoOptimismToken } from "@/utils/token-list/transform-optimism-token";

export const useTokenLists = () => {
  const customTokenLists = useSettingsState.useCustomTokenLists();
  const setTokens = useConfigState.useSetTokens();
  const setTokensImportedFromLists =
    useConfigState.useSetTokensImportedFromLists();

  const updateTokens = useCallback(async () => {
    const multichainTokens: {
      [id: string]: MultiChainToken;
    } = {};

    /**
     * Only Superchain token lists for now
     */

    const [
      superchainTokenListResponse,
      superbridgeTokenListResponse,
      ...customTokenListResponses
    ] = await Promise.all([
      fetch(
        "https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json"
      ).catch(() => null),
      fetch(
        "https://raw.githubusercontent.com/superbridgeapp/token-lists/main/superchain.tokenlist.json"
      ).catch(() => null),
      ...customTokenLists
        .filter((x) => x.enabled)
        .map(async (x) => ({
          tokenList: x,
          response: await fetch(x.url).catch(() => null),
        })),
    ]);

    const [
      superchainTokenListResult,
      superbridgeTokenListResult,
      ...customTokenListResults
    ]: [
      SuperchainTokenList | null,
      SuperbridgeTokenList | null,
      ...({ tokenList: CustomTokenList; result: SuperchainTokenList } | null)[],
    ] = await Promise.all([
      superchainTokenListResponse?.json().catch(() => null),
      superbridgeTokenListResponse?.json().catch(() => null),
      ...customTokenListResponses
        .filter((x) => x?.response?.status === 200)
        .map(async (x) => ({
          tokenList: x.tokenList,
          result: await x.response?.json().catch(() => null),
        })),
    ]);

    superchainTokenListResult?.tokens.forEach((t) => {
      const tok = transformIntoOptimismToken(t);
      if (!tok || Object.keys(tok.standardBridgeAddresses).length == 0) {
        return;
      }

      if (multichainTokens[tok.opTokenId]) {
        multichainTokens[tok.opTokenId][tok.chainId] = tok;
      } else {
        multichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
      }
    });

    superbridgeTokenListResult?.tokens.forEach((t) => {
      const tok: OptimismToken = {
        ...t,
        standardBridgeAddresses: t.extensions.standardBridgeAddresses,
        opTokenId: t.extensions.opTokenId,
      };

      if (!tok || Object.keys(tok.standardBridgeAddresses).length == 0) {
        return;
      }

      if (multichainTokens[tok.opTokenId]) {
        multichainTokens[tok.opTokenId][tok.chainId] = tok;
      } else {
        multichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
      }
    });

    let customTokensFromLists: string[] = [];

    customTokenListResults.filter(isPresent).forEach(({ tokenList, result }) =>
      result.tokens.forEach((t) => {
        const tok = transformIntoOptimismToken(t);
        if (!tok || Object.keys(tok.standardBridgeAddresses).length == 0) {
          return;
        }

        // we don't let custom tokens override existing ones
        if (multichainTokens[tok.opTokenId]?.[tok.chainId]) {
          return;
        }

        if (multichainTokens[tok.opTokenId]) {
          multichainTokens[tok.opTokenId][tok.chainId] = tok;
        } else {
          multichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
        }

        customTokensFromLists.push(
          `${tok.address.toLowerCase()}-${tok.chainId}:${tokenList.name}`
        );
      })
    );

    setTokensImportedFromLists(customTokensFromLists);

    /**
     * Local tokens
     */

    [...usdc.bridged, ...usdc.native].forEach((tok) => {
      if (multichainTokens[tok.opTokenId]) {
        multichainTokens[tok.opTokenId][tok.chainId] = tok;
      } else {
        multichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
      }
    });

    /**
     * Arbitrum
     */

    const arbitrumMultichainTokens = transformArbitrumTokenList([
      ...ArbArbitrumTokenList.tokens,
      ...UniswapArbitrumTokenList.tokens,
      ...MockArbitrumTokenList.tokens,
    ]);

    setTokens(
      Object.values({
        ...multichainTokens,
        ...arbitrumMultichainTokens,
      })
    );
  }, [customTokenLists]);

  useEffect(() => {
    updateTokens();
  }, [updateTokens]);
};
