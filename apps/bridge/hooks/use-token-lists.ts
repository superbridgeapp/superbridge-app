import { useEffect } from "react";
import { getAddress } from "viem";

import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { MultiChainOptimismToken } from "@/types/token";
import { SuperchainTokenList } from "@/types/token-lists";
import UniswapArbitrumTokenList from "@/utils/token-list/json/arbitrum-uniswap.json";
import ArbitrumTokenList from "@/utils/token-list/json/arbitrum.json";
import { baseTokens } from "@/utils/token-list/json/base";
import { dog } from "@/utils/token-list/json/dog";
import * as kroma from "@/utils/token-list/json/kroma";
import MockArbitrumTokenList from "@/utils/token-list/json/mock-arbitrum.json";
import * as pgn from "@/utils/token-list/json/pgn";
import { rollux } from "@/utils/token-list/json/rollux";
import * as usdc from "@/utils/token-list/json/usdc";
import { wsteth } from "@/utils/token-list/json/wsteth";
import { transformArbitrumTokenList } from "@/utils/token-list/transform-arbitrum-token-list";
import { transformIntoOptimismToken } from "@/utils/token-list/transform-optimism-token";
import { seam } from "@/utils/token-list/json/seam";

export const useTokenLists = () => {
  const tokenLists = useSettingsState.useTokenLists();
  const setTokens = useConfigState.useSetTokens();

  const updateTokens = async (lists: string[]) => {
    const optimismMultichainTokens: {
      [id: string]: MultiChainOptimismToken;
    } = {};

    /**
     * Only Superchain token lists for now
     */

    const responses = await Promise.all(lists.map((uri) => fetch(uri)));
    const results: SuperchainTokenList[] = await Promise.all(
      responses.filter((x) => x.status === 200).map((x) => x.json())
    );

    results.forEach((x) =>
      x.tokens.forEach((t) => {
        const tok = transformIntoOptimismToken(t);
        if (!tok || Object.keys(tok.standardBridgeAddresses).length == 0) {
          return;
        }

        if (optimismMultichainTokens[tok.opTokenId]) {
          optimismMultichainTokens[tok.opTokenId][tok.chainId] = tok;
        } else {
          optimismMultichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
        }
      })
    );

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
    ].forEach((tok) => {
      if (optimismMultichainTokens[tok.opTokenId]) {
        optimismMultichainTokens[tok.opTokenId][tok.chainId] = tok;
      } else {
        optimismMultichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
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
    ].forEach(({ tokens, standardBridgeAddress }) => {
      tokens.forEach((token) => {
        if (!optimismMultichainTokens[token.opTokenId]) {
          optimismMultichainTokens[token.opTokenId] = {
            [token.chainId]: token,
          };
        } else {
          optimismMultichainTokens[token.opTokenId][token.chainId] = token;
        }

        Object.keys(token.standardBridgeAddresses).forEach((_l1ChainId) => {
          const l1ChainId = parseInt(_l1ChainId);
          if (!optimismMultichainTokens[token.opTokenId][l1ChainId]) {
            return;
          }

          optimismMultichainTokens[token.opTokenId]![
            l1ChainId
          ]!.standardBridgeAddresses[token.chainId] = getAddress(
            standardBridgeAddress
          );
        });
      });
    });

    /**
     * Arbitrum
     */

    const arbitrumMultichainTokens = transformArbitrumTokenList([
      ...ArbitrumTokenList.tokens,
      ...UniswapArbitrumTokenList.tokens,
      ...MockArbitrumTokenList.tokens,
    ]);

    setTokens(
      Object.values({
        ...optimismMultichainTokens,
        ...arbitrumMultichainTokens,
      })
    );
  };

  useEffect(() => {
    updateTokens(tokenLists);
  }, [tokenLists]);
};
