import { useMemo } from "react";
import { Address, erc20Abi, zeroAddress } from "viem";
import { useReadContracts } from "wagmi";

import { IERC20BridgeAbi } from "@/abis/arbitrum/IERC20Bridge";
import { MultiChainToken } from "@/types/token";
import { isArbitrum } from "@/utils/is-mainnet";

import { useDeployments } from "../use-deployments";

export const useArbitrumNativeTokens = () => {
  const { deployments } = useDeployments();

  const nativeTokens = useReadContracts({
    contracts: deployments.map((d) => ({
      abi: IERC20BridgeAbi,
      functionName: "nativeToken",
      chainId: d?.l1.id,
      address: isArbitrum(d) ? (d.contractAddresses.bridge as Address) : "0x",
      enabled: !isArbitrum(d),
    })),
  });

  const reads = useReadContracts({
    allowFailure: true,
    contracts: nativeTokens.data?.flatMap(({ result }, index) => [
      {
        abi: erc20Abi,
        address: result ?? "0x",
        functionName: "name",
        chainId: deployments[index]?.l1.id,
      },
      {
        abi: erc20Abi,
        address: result ?? "0x",
        functionName: "symbol",
        chainId: deployments[index]?.l1.id,
      },
      {
        abi: erc20Abi,
        address: result ?? "0x",
        functionName: "decimals",
        chainId: deployments[index]?.l1.id,
      },
    ]),
  });

  return useMemo(
    () =>
      deployments.map((deployment, index) => {
        if (!isArbitrum(deployment)) {
          return null;
        }

        const address = nativeTokens.data?.[index]?.result as
          | Address
          | undefined;

        const name = reads.data?.[index * 3 + 0]?.result as string | undefined;
        const symbol = reads.data?.[index * 3 + 1]?.result as
          | string
          | undefined;
        const decimals = reads.data?.[index * 3 + 2]?.result as
          | number
          | undefined;
        if (address && name && symbol && typeof decimals === "number") {
          const token: MultiChainToken = {
            [deployment.l1.id]: {
              address,
              name,
              symbol,
              decimals,
              chainId: deployment.l1.id,
              logoURI: "",
              arbitrumBridgeInfo: {
                [deployment.l2.id]: deployment.contractAddresses
                  .l1GatewayRouter as Address,
              },
            },
            [deployment.l2.id]: {
              address: zeroAddress,
              name,
              symbol,
              decimals,
              chainId: deployment.l2.id,
              logoURI: "",
              arbitrumBridgeInfo: {
                [deployment.l1.id]: deployment.contractAddresses
                  .l2GatewayRouter as Address,
              },
            },
          };
          return token;
        }

        return null;
      }),
    [deployments, nativeTokens.data, reads.data]
  );
};
