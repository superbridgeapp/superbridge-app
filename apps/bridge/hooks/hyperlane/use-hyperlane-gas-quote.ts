import { useReadContract } from "wagmi";

import { InterchainGasPaymasterAbi } from "@/abis/hyperlane/InterchainGasPaymaster";
import {
  CCTP_MINT_GAS_COST,
  hyperlaneAddresses,
  hyperlaneDomains,
} from "@/constants/hyperlane";
import { useConfigState } from "@/state/config";
import { isCctp } from "@/utils/is-cctp";

import { useToChain } from "../use-chain";

export const useHyperlaneGasQuote = () => {
  const token = useConfigState.useToken();
  const to = useToChain();

  const destinationHyperlaneDomain = hyperlaneDomains[to?.id ?? 0];

  return useReadContract({
    abi: InterchainGasPaymasterAbi,
    functionName: "quoteGasPayment",
    args: [destinationHyperlaneDomain ?? 0, CCTP_MINT_GAS_COST],
    query: {
      enabled: !!token && isCctp(token),
    },
    address: hyperlaneAddresses[destinationHyperlaneDomain ?? 0]?.igp ?? "0x",
  });
};
