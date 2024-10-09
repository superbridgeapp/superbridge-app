import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { isEth } from "@/utils/tokens/is-eth";

import { useSelectedToken } from "../tokens/use-token";
import { useApprovalAddress } from "./use-approval-address";

export function useAllowance() {
  const token = useSelectedToken();
  const account = useAccount();

  const approvalAddress = useApprovalAddress();
  const allowance = useReadContract({
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address as Address, approvalAddress as Address],
    address: (token?.address as Address) ?? "0x",
    query: {
      enabled:
        !!token && !!account.address && !isEth(token) && !!approvalAddress,
    },
    chainId: token?.chainId,
  });
  return allowance;
}
