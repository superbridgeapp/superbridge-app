import { Address } from "viem";
import { useReadContract } from "wagmi";

import { TokenMinterAbi } from "@/abis/cctp/TokenMinter";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";
import { isNativeUsdc } from "@/utils/is-usdc";

import { useFromChain } from "./use-chain";

export const useBridgeLimit = () => {
  const domains = useInjectedStore((s) => s.cctpDomains);
  const stateToken = useConfigState.useToken();
  const from = useFromChain();

  const fromDomain = domains.find((x) => x.chainId === from?.id);

  const burnLimitsPerMessage = useReadContract({
    abi: TokenMinterAbi,
    functionName: "burnLimitsPerMessage",
    args: [stateToken?.[from?.id ?? 0]?.address as Address],
    address: fromDomain?.contractAddresses.minter as Address,
    query: {
      enabled: isNativeUsdc(stateToken),
    },
    chainId: from?.id,
  });

  return burnLimitsPerMessage.data;
};
