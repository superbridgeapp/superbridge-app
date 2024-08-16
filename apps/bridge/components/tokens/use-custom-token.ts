import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract, useReadContracts } from "wagmi";

import { L2StandardBridgeAbi } from "@/abis/L2StandardBridge";
import { OptimismMintableERC20Abi } from "@/abis/OptimismMintableERC20";
import { L2ERC20GatewayAbi } from "@/abis/arbitrum/L2ERC20Gateway";
import { StandardArbERC20Abi } from "@/abis/arbitrum/StandardArbERC20";
import { useDeployment } from "@/hooks/deployments/use-deployment";

export const useCustomToken = (address: string | null) => {
  const deployment = useDeployment();
  const account = useAccount();

  const reads = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address: address as Address,
        abi: erc20Abi,
        chainId: deployment?.l2.id,
        functionName: "name",
      },
      {
        address: address as Address,
        abi: erc20Abi,
        chainId: deployment?.l2.id,
        functionName: "symbol",
      },
      {
        address: address as Address,
        abi: erc20Abi,
        chainId: deployment?.l2.id,
        functionName: "decimals",
      },
      {
        address: address as Address,
        abi: erc20Abi,
        chainId: deployment?.l2.id,
        functionName: "balanceOf",
        args: [account?.address ?? "0x"],
      },

      // Optimism
      {
        address: address as Address,
        abi: OptimismMintableERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "BRIDGE",
      },
      {
        address: address as Address,
        abi: OptimismMintableERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "REMOTE_TOKEN",
      },

      // Arbitrum
      {
        address: address as Address,
        abi: StandardArbERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "l1Address",
      },
      {
        address: address as Address,
        abi: StandardArbERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "l2Gateway",
      },

      // L1
      {
        address: address as Address,
        abi: erc20Abi,
        chainId: deployment?.l1.id,
        functionName: "name",
      },
    ],
  });
  const name = reads.data?.[0].result;
  const symbol = reads.data?.[1].result;
  const decimals = reads.data?.[2].result;
  const balance = reads.data?.[3].result;

  const OP_L2_BRIDGE = reads.data?.[4].result;
  const OP_L1_TOKEN = reads.data?.[5].result;

  const ARB_L1_TOKEN = reads.data?.[6].result;
  const ARB_L2_GATEWAY = reads.data?.[7].result;

  const isL1Token = !!reads.data?.[8].result;

  const opL2Bridge = useReadContract({
    address: OP_L2_BRIDGE,
    abi: L2StandardBridgeAbi,
    chainId: deployment?.l2.id,
    functionName: "OTHER_BRIDGE",
  });
  const arbL2Gateway = useReadContract({
    address: ARB_L2_GATEWAY,
    abi: L2ERC20GatewayAbi,
    chainId: deployment?.l2.id,
    functionName: "counterpartGateway",
  });
  const OP_L1_BRIDGE = opL2Bridge.data;
  const ARB_L1_GATEWAY = arbL2Gateway.data;

  const isValidToken = !!name && !!symbol && typeof decimals === "number";
  const isOptimismToken = !!OP_L2_BRIDGE && !!OP_L1_BRIDGE && !!OP_L1_TOKEN;
  const isArbitrumToken =
    !!ARB_L1_TOKEN && !!ARB_L2_GATEWAY && !!ARB_L1_GATEWAY;

  return {
    name,
    symbol,
    balance,
    decimals,

    OP_L1_BRIDGE,
    OP_L2_BRIDGE,
    OP_L1_TOKEN,

    ARB_L1_TOKEN,
    ARB_L2_GATEWAY,
    ARB_L1_GATEWAY,

    isValidToken,
    isOptimismToken,
    isArbitrumToken,
    isL1Token,

    isLoading:
      reads.isLoading ||
      (OP_L2_BRIDGE && opL2Bridge.isLoading) ||
      (ARB_L2_GATEWAY && arbL2Gateway.isLoading),
    isError: reads.isError || opL2Bridge.isError || arbL2Gateway.isError,
  };
};
