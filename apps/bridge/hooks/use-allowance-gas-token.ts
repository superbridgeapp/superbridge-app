import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { useCustomGasTokenAddress } from "./custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "./deployments/use-deployment";
import { useApprovalAddressGasToken } from "./use-approval-address-gas-token";
import { useFromChain } from "./use-chain";

export function useAllowanceGasToken() {
  const account = useAccount();
  const deployment = useDeployment();
  const customGasTokenAddress = useCustomGasTokenAddress(deployment?.id);
  const from = useFromChain();
  const approvalAddress = useApprovalAddressGasToken();

  const allowance = useReadContract({
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address as Address, approvalAddress as Address],
    address: customGasTokenAddress as Address | undefined,
    chainId: from?.id,
  });
  return allowance;
}
