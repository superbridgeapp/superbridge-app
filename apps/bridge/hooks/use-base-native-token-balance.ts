import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { useDeployment } from "./use-deployment";
import { useIsArbitrumDeposit } from "./use-withdrawing";

export function useBaseNativeTokenBalance() {
  const isArbitrumDeposit = useIsArbitrumDeposit();
  const deployment = useDeployment();
  const account = useAccount();

  return useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address as Address],
    chainId: deployment?.l1.id,
    address: deployment?.arbitrumNativeToken?.address as Address,
    query: {
      enabled: isArbitrumDeposit,
    },
  });
}
