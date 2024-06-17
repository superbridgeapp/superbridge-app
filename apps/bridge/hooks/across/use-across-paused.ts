import { Address } from "viem";
import { useReadContracts } from "wagmi";

import { SpokePoolAbi } from "@/abis/across/SpokePool";
import { useConfigState } from "@/state/config";

import { useAcrossDomains } from "../use-across-domains";
import { useFromChain, useToChain } from "../use-chain";

export const useAcrossPaused = () => {
  const fast = useConfigState.useFast();
  const from = useFromChain();
  const to = useToChain();
  const acrossDomains = useAcrossDomains();
  const fromDomain = acrossDomains.find((x) => x.chain.id === from?.id);
  const toDomain = acrossDomains.find((x) => x.chain.id === to?.id);

  const reads = useReadContracts({
    contracts: [
      {
        abi: SpokePoolAbi,
        functionName: "pausedDeposits",
        address: fromDomain?.contractAddresses.spokePool as Address,
        chainId: from?.id,
      },
      {
        abi: SpokePoolAbi,
        functionName: "pauseFills",
        address: toDomain?.contractAddresses.spokePool as Address,
        chainId: to?.id,
      },
    ],
    query: {
      enabled: fast,
    },
  });

  return (reads.data?.[0].result || reads.data?.[1].result) ?? false;
};
