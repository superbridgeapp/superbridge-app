import { Address, erc721ABI, useAccount, useContractRead } from "wagmi";

import { useConfigState } from "@/state/config";
import { isAddressEqual } from "viem";

export function useAllowanceNft() {
  const nft = useConfigState.useNft();
  const account = useAccount();

  const bridgeAddress = nft?.localConfig.bridgeAddress as Address | undefined;

  const allowance = useContractRead({
    abi: erc721ABI,
    functionName: "getApproved",
    args: [nft?.tokenId ? BigInt(nft.tokenId) : BigInt(0)],
    address: nft?.localConfig.address as Address | undefined,
    enabled: !!account.address && !!nft && !!bridgeAddress,
  });

  return {
    ...allowance,
    data:
      !!allowance.data &&
      !!bridgeAddress &&
      isAddressEqual(allowance.data, bridgeAddress),
  };
}
