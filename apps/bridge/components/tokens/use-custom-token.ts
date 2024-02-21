import { Address } from "viem";
import { erc20ABI, useAccount, useContractReads } from "wagmi";

import { L2StandardBridgeAbi } from "@/abis/L2StandardBridge";
import { OptimismMintableERC20Abi } from "@/abis/OptimismMintableERC20";
import { useConfigState } from "@/state/config";

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
    ],
  });
  const name = reads?.data?.[0].result;
  const symbol = reads?.data?.[1].result;
  const decimals = reads?.data?.[2].result;
  const balance = reads?.data?.[3].result;
  const L2_BRIDGE = reads?.data?.[4].result;
  const L1_TOKEN = reads?.data?.[5].result;

  const reads2 = useContractReads({
    allowFailure: true,
    contracts: [
      {
        address: L2_BRIDGE,
        abi: L2StandardBridgeAbi,
        chainId: deployment?.l2.id,
        functionName: "OTHER_BRIDGE",
      },
    ],
  });
  const L1_BRIDGE = reads2?.data?.[0].result as Address | undefined;

  const isValidToken = !!name && !!symbol && typeof decimals === "number";
  const isOptimismMintableToken = !!L2_BRIDGE && !!L1_BRIDGE && !!L1_TOKEN;

  return {
    name,
    symbol,
    balance,
    L1_BRIDGE,
    L2_BRIDGE,
    L1_TOKEN,
    decimals,

    isValidToken,
    isOptimismMintableToken,

    isLoading: reads.isLoading || reads2.isLoading,
    isError: reads.isError || reads2.isError,
  };
};
