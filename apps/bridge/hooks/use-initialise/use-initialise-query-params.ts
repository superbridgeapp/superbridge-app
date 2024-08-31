import { useRouter } from "next/router";
import { useEffect } from "react";
import { Address, isAddress, isAddressEqual } from "viem";

import { useConfigState } from "@/state/config";
import { MultiChainToken } from "@/types/token";

import { useDeployment } from "../deployments/use-deployment";
import { useSaveWarpRouteFile } from "../hyperlane/use-save-warp-route-file";
import { useActiveTokens } from "../tokens/use-active-tokens";
import { useSetToken } from "../tokens/use-set-token";
import { useFromChain, useToChain } from "../use-chain";

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
 * ?fromChainId - handled handled in use-initiate-injected-store
 * ?toChainId - handled handled in use-initiate-injected-store
 * ?tokenAddress - handled here
 */
export const useInitialiseQueryParams = () => {
  const router = useRouter();

  const setToken = useSetToken();
  const setRawAmount = useConfigState.useSetRawAmount();
  const deployment = useDeployment();
  const from = useFromChain();
  const to = useToChain();
  const tokens = useActiveTokens();
  const saveWarpRouteFile = useSaveWarpRouteFile();

  useEffect(() => {
    const hyperlaneWarpRoutes = router.query.hyperlaneWarpRoutes as
      | string
      | undefined;
    if (hyperlaneWarpRoutes) {
      saveWarpRouteFile.mutateAsync(hyperlaneWarpRoutes).then((valid) => {
        if (valid) {
          router.replace(
            "/",
            {
              pathname: "/",
              query: {
                hyperlaneWarpRoutes:
                  Buffer.from(hyperlaneWarpRoutes).toString("base64"),
              },
            },
            { shallow: true }
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!tokens.data?.length || !from || !to) {
      return;
    }

    const amount = router.query.amount as string | undefined;
    if (amount && parseFloat(amount)) {
      setRawAmount(amount);
    }

    const [deploymentTokenUndefined, tokenUndefined]: (string | undefined)[] =
      router.asPath.split(/[?\/]/).filter(Boolean);

    const isLegacyRouteParams =
      (!!deploymentTokenUndefined || !!deploymentTokenUndefined) &&
      !deploymentTokenUndefined.includes("&");

    let token: MultiChainToken | undefined;
    if (isLegacyRouteParams) {
      token = tokens.data.find((x) => {
        const fromToken = x[from.id];
        const toToken = x[to.id];
        if (!fromToken || !toToken) {
          return;
        }

        if (deploymentTokenUndefined) {
          if (isAddress(deploymentTokenUndefined)) {
            return isAddressEqual(
              deploymentTokenUndefined,
              fromToken.address as Address
            );
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
            return isAddressEqual(tokenUndefined, fromToken.address as Address);
          }

          return (
            tokenUndefined.toLowerCase() === fromToken.symbol.toLowerCase()
          );
        }
      });

      if (token) {
        setToken(token[from.id]!);
      }
    } else {
      const tokenAddress = router.query.tokenAddress as string | undefined;
      if (tokenAddress) {
        token = tokens.data.find((x) => {
          const fromToken = x[from.id];
          const toToken = x[to.id];
          if (!fromToken || !toToken) {
            return false;
          }

          if (isAddress(tokenAddress)) {
            return isAddressEqual(tokenAddress, fromToken.address as Address);
          }
        });
      }

      if (token) {
        setToken(token[from.id]!);
      }
    }
  }, [router.asPath, deployment, tokens]);
};
