import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAddress, isAddressEqual } from "viem";

import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";
import { isNativeToken } from "@/utils/is-eth";

import { useGasToken } from "./use-approve-gas-token";
import { useFromChain, useToChain } from "./use-chain";
import { useDeployment } from "./use-deployment";
import { useAllTokens } from "./use-tokens";

/**
 * // legacy & new
 * ?recipient - handled in useInitialiseRecipient
 * ?amount - handled here
 *
 * // legacy
 * /usdc - handled here
 * /base/usdc - handled here (network handled in use-initiate-injected-store)
 * ?direction - handled handled in use-initiate-injected-store
 *
 * // new
 * ?fromChainId - handled here
 * ?toChainId - handled here
 * ?tokenAddress - handled here
 */
export const useInitialiseQueryParams = () => {
  const router = useRouter();

  const setToken = useConfigState.useSetToken();
  const setRawAmount = useConfigState.useSetRawAmount();
  const setFromChainId = useInjectedStore((s) => s.setFromChainId);
  const setToChainId = useInjectedStore((s) => s.setToChainId);
  const deployment = useDeployment();
  const from = useFromChain();
  const to = useToChain();
  const tokens = useAllTokens();
  const arbitrumGasToken = useGasToken();

  useEffect(() => {
    if (!tokens.length || !from || !to) {
      return;
    }

    const amount = router.query.amount as string | undefined;
    if (amount && parseFloat(amount)) {
      setRawAmount(amount);
    }

    const [deploymentTokenUndefined, tokenUndefined]: (string | undefined)[] =
      router.asPath.split(/[?\/]/).filter(Boolean);

    const isLegacyRouteParams =
      !!deploymentTokenUndefined || !!deploymentTokenUndefined;

    if (isLegacyRouteParams) {
      const token = tokens.find((x) => {
        const fromToken = x[from.id];
        const toToken = x[to.id];
        if (!fromToken || !toToken) {
          return;
        }

        if (deploymentTokenUndefined) {
          if (isAddress(deploymentTokenUndefined)) {
            return isAddressEqual(deploymentTokenUndefined, fromToken.address);
          }
          if (
            deploymentTokenUndefined.toLowerCase() ===
            fromToken.symbol.toLowerCase()
          ) {
            return true;
          }
        }

        if (tokenUndefined) {
          if (isAddress(tokenUndefined)) {
            return isAddressEqual(tokenUndefined, fromToken.address);
          }

          return (
            tokenUndefined.toLowerCase() === fromToken.symbol.toLowerCase()
          );
        }
      });

      if (token) {
        setToken(token);
      } else if (arbitrumGasToken) {
        setToken(arbitrumGasToken);
      } else {
        setToken(tokens.find((x) => isNativeToken(x)) ?? null);
      }
    } else {
      const fromChainId = router.query.fromChainId as string | undefined;
      if (fromChainId) {
        setFromChainId(parseInt(fromChainId));
      }

      const toChainId = router.query.toChainId as string | undefined;
      if (toChainId) {
        setToChainId(parseInt(toChainId));
      }

      const tokenAddress = router.query.tokenAddress as string | undefined;
      if (tokenAddress) {
        const token = tokens.find((x) => {
          const fromToken = x[from.id];
          const toToken = x[to.id];
          if (!fromToken || !toToken) {
            return false;
          }

          if (isAddress(tokenAddress)) {
            return isAddressEqual(tokenAddress, fromToken.address);
          }
        });
        if (token) {
          setToken(token);
        }
      }
    }
  }, [router.asPath, deployment, tokens, arbitrumGasToken]);
};
