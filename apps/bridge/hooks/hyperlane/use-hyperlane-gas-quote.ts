import { useReadContract } from "wagmi";

import { InterchainGasPaymasterAbi } from "@/abis/hyperlane/InterchainGasPaymaster";
import {
  CCTP_MINT_GAS_COST,
  hyperlaneAddresses,
  hyperlaneDomains,
} from "@/constants/hyperlane";
import { useConfigState } from "@/state/config";

import { useDeployment } from "../use-deployment";
import { isCctpBridgeOperation } from "../use-transaction-args/cctp-args/common";

export const useFromChain = () => {
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  return withdrawing ? deployment?.l2 : deployment?.l1;
};

export const useToChain = () => {
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  return withdrawing ? deployment?.l1 : deployment?.l2;
};

export const useHyperlaneGasQuote = () => {
  const token = useConfigState.useToken();
  const to = useToChain();

  const destinationHyperlaneDomain = hyperlaneDomains[to?.id ?? 0];

  return useReadContract({
    abi: InterchainGasPaymasterAbi,
    functionName: "quoteGasPayment",
    args: [destinationHyperlaneDomain ?? 0, CCTP_MINT_GAS_COST],
    query: {
      enabled: !!token && isCctpBridgeOperation(token),
    },
    address: hyperlaneAddresses[destinationHyperlaneDomain ?? 0]?.igp ?? "0x",
  });
};
