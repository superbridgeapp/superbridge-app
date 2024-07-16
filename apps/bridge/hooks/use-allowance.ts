import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { Token } from "@/types/token";
import { isEth } from "@/utils/is-eth";

export function useAllowance(
  token: Token | null,
  contract: string | undefined
) {
  const account = useAccount();
  const allowance = useReadContract({
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address ?? "0x", (contract as Address) ?? "0x"],
    address: (token?.address as Address) ?? "0x",
    query: {
      enabled: !!token && !!account.address && !isEth(token) && !!contract,
    },
    chainId: token?.chainId,
  });
  return allowance;
}
