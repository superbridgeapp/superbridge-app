import { useEffect } from "react";
import {
  useContractWrite,
  useWaitForTransaction,
  erc721ABI,
  Address,
} from "wagmi";

import { useConfigState } from "@/state/config";

export function useApproveNft(
  refreshAllowance: () => void,
  refreshTx: () => void
) {
  const nft = useConfigState.useNft();
  const {
    write,
    data,
    isLoading: writing,
  } = useContractWrite({
    abi: erc721ABI,
    address: nft?.localConfig.address as Address | undefined,
    args: [
      (nft?.localConfig.bridgeAddress as Address | undefined) ?? "0x", // to
      nft ? BigInt(nft.tokenId) : BigInt("0"), // tokenId
    ],
    functionName: "approve",
  });
  const { isLoading: waiting, data: receipt } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (receipt) {
      refreshAllowance();
      refreshTx();
      setTimeout(() => {
        refreshAllowance();
        refreshTx();
      }, 200);
    }
  }, [receipt]);

  return {
    write,
    isLoading: writing || waiting,
  };
}
