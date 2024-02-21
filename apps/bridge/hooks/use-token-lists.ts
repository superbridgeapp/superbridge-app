import { useCallback, useEffect } from "react";
import { getAddress } from "viem";

import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { ArbitrumToken, MultiChainToken } from "@/types/token";
import {
  ArbitrumTokenListToken,
  SuperchainTokenList,
} from "@/types/token-lists";
import { baseTokens } from "@/utils/token-list/json/base";
import { dog } from "@/utils/token-list/json/dog";
import * as kroma from "@/utils/token-list/json/kroma";
import * as pgn from "@/utils/token-list/json/pgn";
import { rollux } from "@/utils/token-list/json/rollux";
import * as usdc from "@/utils/token-list/json/usdc";
import { wsteth } from "@/utils/token-list/json/wsteth";
import { transformIntoOptimismToken } from "@/utils/token-list/transform-optimism-token";

export const useTokenLists = () => {
  const defaultTokenLists = useSettingsState.useDefaultTokenLists();
  const customTokenLists = useSettingsState.useCustomTokenLists();
  const setTokens = useConfigState.useSetTokens();

  const updateTokens = useCallback(async () => {
    const multichainTokens: {
      [id: string]: MultiChainToken;
    } = {};

    /**
     * Only Superchain token lists for now
     */

    const responses = await Promise.all(
      [...defaultTokenLists, ...customTokenLists].map(({ url }) => fetch(url))
    );
    const results: SuperchainTokenList[] = await Promise.all(
      responses.filter((x) => x.status === 200).map((x) => x.json())
    );

    results.forEach((x) =>
      x.tokens.forEach((t) => {
        if ((t as any).extensions.opTokenId) {
          const tok = transformIntoOptimismToken(t);
          if (!tok || Object.keys(tok.standardBridgeAddresses).length == 0) {
            return;
          }

          if (multichainTokens[tok.opTokenId]) {
            multichainTokens[tok.opTokenId][tok.chainId] = tok;
          } else {
            multichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
          }
        }

        if ((t as any).extensions.bridgeInfo) {
          const _t = t as unknown as ArbitrumTokenListToken;

          const tok: ArbitrumToken = {
            address: _t.address,
            chainId: _t.chainId,
            name: _t.name,
            symbol: _t.symbol,
            decimals: _t.decimals,
            logoURI: _t.logoURI,
            arbitrumBridgeInfo: {},
          };

          multichainTokens[tok.address] = {
            [t.chainId]: {
              ...tok,
              arbitrumBridgeInfo: {},
            },
          };

          Object.entries(_t.extensions?.bridgeInfo ?? {}).forEach(
            ([_chainId, config]) => {
              const destinationChainId = parseInt(_chainId);

              tok.arbitrumBridgeInfo[destinationChainId] =
                config!.originBridgeAddress;

              multichainTokens[tok.address]![destinationChainId] = {
                ...t!,
                chainId: destinationChainId,
                address: getAddress(config!.tokenAddress),
                arbitrumBridgeInfo: {
                  [t.chainId]: config!.destBridgeAddress,
                },
              };
            }
          );
        }
      })
    );

    // /**
    //  * Local tokens
    //  */

    // // Fully qualified tokens, where we have all the StandardBridge mappings done.
    // // Kroma is a special case but we ensure we do the L2 token mappings below
    // [
    //   ...kroma.l1Tokens,
    //   ...usdc.bridged,
    //   ...usdc.native,
    //   ...wsteth,
    //   ...dog,
    //   ...rollux,
    //   ...baseTokens,
    // ].forEach((tok) => {
    //   if (optimismMultichainTokens[tok.opTokenId]) {
    //     optimismMultichainTokens[tok.opTokenId][tok.chainId] = tok;
    //   } else {
    //     optimismMultichainTokens[tok.opTokenId] = { [tok.chainId]: tok };
    //   }
    // });

    // // Some token lists, like PGN, we only specify the L2 tokens. So we need to
    // // ensure we add the apppropriate standard bridge address to the corresponding
    // // L1 tokens
    // [
    //   {
    //     tokens: kroma.l2Tokens,
    //     standardBridgeAddress: kroma.l1StandardBridgeAddress,
    //   },
    //   {
    //     tokens: pgn.tokens,
    //     standardBridgeAddress: pgn.l1StandardBridgeAddress,
    //   },
    // ].forEach(({ tokens, standardBridgeAddress }) => {
    //   tokens.forEach((token) => {
    //     if (!optimismMultichainTokens[token.opTokenId]) {
    //       optimismMultichainTokens[token.opTokenId] = {
    //         [token.chainId]: token,
    //       };
    //     } else {
    //       optimismMultichainTokens[token.opTokenId][token.chainId] = token;
    //     }

    //     Object.keys(token.standardBridgeAddresses).forEach((_l1ChainId) => {
    //       const l1ChainId = parseInt(_l1ChainId);
    //       if (!optimismMultichainTokens[token.opTokenId][l1ChainId]) {
    //         return;
    //       }

    //       optimismMultichainTokens[token.opTokenId]![
    //         l1ChainId
    //       ]!.standardBridgeAddresses[token.chainId] = getAddress(
    //         standardBridgeAddress
    //       );
    //     });
    //   });
    // });

    setTokens(Object.values(multichainTokens));
  }, [defaultTokenLists, customTokenLists]);

  useEffect(() => {
    updateTokens();
  }, [updateTokens]);
};
