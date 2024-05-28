import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { useApprovalAddressGasToken } from "./use-approval-address-gas-token";
import { useGasToken } from "./use-approve-gas-token";
import { useFromChain } from "./use-chain";

export function useAllowanceGasToken() {
  const account = useAccount();
  const gasToken = useGasToken();
  const from = useFromChain();
  const approvalAddress = useApprovalAddressGasToken();

  const gasTokenAddress = gasToken?.[from?.id ?? 0]?.address;

  const allowance = useReadContract({
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address as Address, approvalAddress as Address],
    address: gasTokenAddress,
    chainId: from?.id,
  });
  return allowance;
}
