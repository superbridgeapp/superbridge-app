import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Address, erc721Abi } from "viem";

import { useConfigState } from "@/state/config";

export function useApproveNft(
  refreshAllowance: () => void,
  refreshTx: () => void
) {
  const nft = useConfigState.useNft();
  const { data: hash, isLoading: writing, writeContract } = useWriteContract();
  const { isLoading: waiting, data: receipt } = useWaitForTransactionReceipt({
    hash,
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
    write: () => {
      if (!nft?.localConfig.address) {
        return;
      }
      writeContract({
        abi: erc721Abi,
        address: nft.localConfig.address as Address,
        args: [
          (nft?.localConfig.bridgeAddress as Address | undefined) ?? "0x", // to
          nft ? BigInt(nft.tokenId) : BigInt("0"), // tokenId
        ],
        functionName: "approve",
      });
    },
    isLoading: writing || waiting,
  };
}
