import { Address } from "viem";
import { erc20ABI, useAccount, useContractReads } from "wagmi";

import { L2StandardBridgeAbi } from "@/abis/L2StandardBridge";
import { OptimismMintableERC20Abi } from "@/abis/OptimismMintableERC20";
import { useConfigState } from "@/state/config";
import { StandardArbERC20Abi } from "@/abis/arbitrum/StandardArbERC20";
import { L2ERC20GatewayAbi } from "@/abis/arbitrum/L2ERC20Gateway";

export const useCustomToken = (address: Address) => {
  const deployment = useConfigState.useDeployment();
  const account = useAccount();

  const reads = useContractReads({
    allowFailure: true,
    contracts: [
      {
        address,
        abi: erc20ABI,
        chainId: deployment?.l2.id,
        functionName: "name",
      },
      {
        address,
        abi: erc20ABI,
        chainId: deployment?.l2.id,
        functionName: "symbol",
      },
      {
        address,
        abi: erc20ABI,
        chainId: deployment?.l2.id,
        functionName: "decimals",
      },
      {
        address,
        abi: erc20ABI,
        chainId: deployment?.l2.id,
        functionName: "balanceOf",
        args: [account?.address ?? "0x"],
      },

      // Optimism
      {
        address,
        abi: OptimismMintableERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "BRIDGE",
      },
      {
        address,
        abi: OptimismMintableERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "REMOTE_TOKEN",
      },

      // Arbitrum
      {
        address,
        abi: StandardArbERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "l1Address",
      },
      {
        address,
        abi: StandardArbERC20Abi,
        chainId: deployment?.l2.id,
        functionName: "l2Gateway",
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

  const reads2 = useContractReads({
    allowFailure: true,
    contracts: [
      {
        address: OP_L2_BRIDGE,
        abi: L2StandardBridgeAbi,
        chainId: deployment?.l2.id,
        functionName: "OTHER_BRIDGE",
      },
      {
        address: ARB_L2_GATEWAY,
        abi: L2ERC20GatewayAbi,
        chainId: deployment?.l2.id,
        functionName: "counterpartGateway",
      },
    ],
  });
  const OP_L1_BRIDGE = reads2.data?.[0].result;
  const ARB_L1_GATEWAY = reads.data?.[1].result;

  const isValidToken = !!name && !!symbol && typeof decimals === "number";
  const isOptimismToken = !!OP_L2_BRIDGE && !!OP_L1_BRIDGE && !!OP_L1_TOKEN;
  const isArbitrumToken = !!ARB_L1_TOKEN && !!ARB_L2_GATEWAY;

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

    isLoading: reads.isLoading || reads2.isLoading,
    isError: reads.isError || reads2.isError,
  };
};
