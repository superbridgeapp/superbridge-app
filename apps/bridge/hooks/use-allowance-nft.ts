import { Address, erc721Abi, isAddressEqual } from "viem";
import { useAccount, useReadContract } from "wagmi";

import { useConfigState } from "@/state/config";

export function useAllowanceNft() {
  const nft = useConfigState.useNft();
  const account = useAccount();

  const bridgeAddress = nft?.localConfig.bridgeAddress as Address | undefined;

  const allowance = useReadContract({
    abi: erc721Abi,
    functionName: "getApproved",
    args: [nft?.tokenId ? BigInt(nft.tokenId) : BigInt(0)],
    address: nft?.localConfig.address as Address | undefined,
    query: {
      enabled: !!account.address && !!nft && !!bridgeAddress,
    },
  });

  return {
    ...allowance,
    data:
      !!allowance.data &&
      !!bridgeAddress &&
      isAddressEqual(allowance.data, bridgeAddress),
  };
}
