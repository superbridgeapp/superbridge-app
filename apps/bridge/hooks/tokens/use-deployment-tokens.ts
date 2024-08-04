import { useMemo } from "react";
import { Address } from "viem";

import { DeploymentFamily } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

import { useDeployments } from "../deployments/use-deployments";

export function useDeploymentTokens(): MultiChainToken[] {
  const deployments = useDeployments();

  return useMemo(
    () =>
      deployments
        .map((d) =>
          d.tokens.map((t) => {
            const opTokenId = `custom-${t.l1.symbol}`;

            if (d.family === DeploymentFamily.optimism) {
              const tok: MultiChainToken = {
                [t.l1.chainId]: {
                  chainId: t.l1.chainId,
                  address: t.l1.address as Address,
                  decimals: t.l1.decimals,
                  name: t.l1.name,
                  symbol: t.l1.symbol,
                  opTokenId,
                  logoURI: t.l1.logoURI,
                  standardBridgeAddresses: {
                    [t.l2.chainId]: t.l1.bridge as Address,
                  },
                },
                [t.l2.chainId]: {
                  chainId: t.l2.chainId,
                  address: t.l2.address as Address,
                  decimals: t.l2.decimals,
                  name: t.l2.name,
                  symbol: t.l2.symbol,
                  logoURI: t.l2.logoURI,
                  opTokenId,
                  standardBridgeAddresses: {
                    [t.l1.chainId]: t.l2.bridge as Address,
                  },
                },
              };

              return tok;
            } else {
              const tok: MultiChainToken = {
                [t.l1.chainId]: {
                  chainId: t.l1.chainId,
                  address: t.l1.address as Address,
                  decimals: t.l1.decimals,
                  name: t.l1.name,
                  symbol: t.l1.symbol,
                  logoURI: t.l1.logoURI,
                  arbitrumBridgeInfo: {
                    [t.l2.chainId]: t.l1.bridge as Address,
                  },
                },
                [t.l2.chainId]: {
                  chainId: t.l2.chainId,
                  address: t.l2.address as Address,
                  decimals: t.l2.decimals,
                  name: t.l2.name,
                  symbol: t.l2.symbol,
                  logoURI: t.l2.logoURI,
                  arbitrumBridgeInfo: {
                    [t.l1.chainId]: t.l2.bridge as Address,
                  },
                },
              };

              return tok;
            }
          })
        )
        .flat(),
    [deployments]
  );
}
