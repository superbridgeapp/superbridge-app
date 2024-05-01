import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { isArbitrum, isOptimism } from "@/utils/is-mainnet";

import { useGasToken } from "./use-approve-gas-token";
import { useFromChain } from "./use-chain";
import { useDeployment } from "./use-deployment";

export function useAllowanceArbitrumGasToken() {
  const account = useAccount();
  const gasToken = useGasToken();
  const from = useFromChain();
  const deployment = useDeployment();

  const gasTokenAddress = gasToken?.[from?.id ?? 0]?.address;
  const allowance = useReadContract({
    abi: erc20Abi,
    functionName: "allowance",
    args: [
      account.address ?? "0x",
      deployment && isArbitrum(deployment)
        ? (deployment.contractAddresses.inbox as Address)
        : deployment && isOptimism(deployment)
        ? (deployment.contractAddresses.optimismPortal as Address)
        : "0x",
    ],
    address: gasTokenAddress,
    query: {
      enabled: !!gasToken && !!account.address && !!deployment,
    },
    chainId: from?.id,
  });
  return allowance;
}
