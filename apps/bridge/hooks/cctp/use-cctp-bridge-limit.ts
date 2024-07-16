import { Address } from "viem";
import { useReadContract } from "wagmi";

import { TokenMinterAbi } from "@/abis/cctp/TokenMinter";
import { useConfigState } from "@/state/config";
import { isCctp } from "@/utils/is-usdc";

import { useCctpDomains } from "../use-cctp-domains";
import { useFromChain } from "../use-chain";

export const useCctpBridgeLimit = () => {
  const domains = useCctpDomains();

  const stateToken = useConfigState.useToken();
  const fast = useConfigState.useFast();
  const from = useFromChain();

  const fromDomain = domains.find((x) => x.chainId === from?.id);

  const burnLimitsPerMessage = useReadContract({
    abi: TokenMinterAbi,
    functionName: "burnLimitsPerMessage",
    args: [stateToken?.[from?.id ?? 0]?.address as Address],
    address: fromDomain?.contractAddresses.minter as Address,
    query: {
      enabled: isCctp(stateToken) && !fast,
    },
    chainId: from?.id,
  });

  return burnLimitsPerMessage.data;
};
