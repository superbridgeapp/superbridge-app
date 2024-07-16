import { useCallback, useEffect } from "react";
import { isPresent } from "ts-is-present";
import { getAddress } from "viem";

import { useConfigState } from "@/state/config";
import { CustomTokenList, useSettingsState } from "@/state/settings";
import { MultiChainToken, OptimismToken } from "@/types/token";
import { SuperbridgeTokenList, SuperchainTokenList } from "@/types/token-lists";
import UniswapArbitrumTokenList from "@/utils/token-list/json/arbitrum-uniswap.json";
import ArbArbitrumTokenList from "@/utils/token-list/json/arbitrum.json";
import { baseTokens } from "@/utils/token-list/json/base";
import { dog } from "@/utils/token-list/json/dog";
import { ebi } from "@/utils/token-list/json/ebi";
import * as kroma from "@/utils/token-list/json/kroma";
import * as lumio from "@/utils/token-list/json/lumio";
import * as metal from "@/utils/token-list/json/metal";
import * as mintTestnet from "@/utils/token-list/json/mint";
import MockArbitrumTokenList from "@/utils/token-list/json/mock-arbitrum.json";
import * as pgn from "@/utils/token-list/json/pgn";
import { rollux } from "@/utils/token-list/json/rollux";
import { seam } from "@/utils/token-list/json/seam";
import * as usdc from "@/utils/token-list/json/usdc";
import { wsteth } from "@/utils/token-list/json/wsteth";
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

    // Fully qualified tokens, where we have all the StandardBridge mappings done.
    // Kroma is a special case but we ensure we do the L2 token mappings below
    [
      ...kroma.l1Tokens,
      ...usdc.bridged,
      ...usdc.native,
      ...wsteth,
      ...dog,
      ...rollux,
      ...baseTokens,
      ...seam,
      ...lumio.FULLY_QUALIFIED_TOKENS,
      ...metal.FULLY_QUALIFIED_TOKENS,
      ...mintTestnet.tokens,
    ].forEach((tok) => {
      if (multichainTokens[tok.opTokenId]) {
        multichainTokens[tok.opTokenId][tok.chainId] = tok;
      } else {
        multichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
      }
    });

    // Some token lists, like PGN, we only specify the L2 tokens. So we need to
    // ensure we add the apppropriate standard bridge address to the corresponding
    // L1 tokens
    [
      {
        tokens: kroma.l2Tokens,
        standardBridgeAddress: kroma.l1StandardBridgeAddress,
      },
      {
        tokens: pgn.tokens,
        standardBridgeAddress: pgn.l1StandardBridgeAddress,
      },
      {
        tokens: lumio.tokens,
        standardBridgeAddress: lumio.l1StandardBridgeAddress,
      },
    ].forEach(({ tokens, standardBridgeAddress }) => {
      tokens.forEach((token) => {
        if (!multichainTokens[token.opTokenId]) {
          multichainTokens[token.opTokenId] = {
            [token.chainId]: token,
          };
        } else {
          multichainTokens[token.opTokenId][token.chainId] = token;
        }

        Object.keys(token.standardBridgeAddresses).forEach((_l1ChainId) => {
          const l1ChainId = parseInt(_l1ChainId);
          if (!multichainTokens[token.opTokenId][l1ChainId]) {
            return;
          }

          (
            multichainTokens[token.opTokenId]![l1ChainId] as OptimismToken
          ).standardBridgeAddresses[token.chainId] = getAddress(
            standardBridgeAddress
          );
        });
      });
    });

    /**
     * Arbitrum
     */

    const arbitrumMultichainTokens = transformArbitrumTokenList([
      ...ArbArbitrumTokenList.tokens,
      ...UniswapArbitrumTokenList.tokens,
      ...MockArbitrumTokenList.tokens,
    ]);

    [...ebi].forEach((tok) => {
      const key = `arbitrum-${tok.symbol}`;
      if (multichainTokens[key]) {
        multichainTokens[key][tok.chainId] = tok;
      } else {
        multichainTokens[key] = { [tok.chainId]: tok };
      }
    });

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
