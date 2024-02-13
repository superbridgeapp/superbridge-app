import { useContractRead } from "wagmi";

import { InterchainGasPaymasterAbi } from "@/abis/hyperlane/InterchainGasPaymaster";
import {
  CCTP_MINT_GAS_COST,
  hyperlaneAddresses,
  hyperlaneDomains,
} from "@/constants/hyperlane";
import { useConfigState } from "@/state/config";
import { isCctpBridgeOperation } from "@/utils/transaction-args/cctp-args/common";

export const useFromChain = () => {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  return withdrawing ? deployment?.l2 : deployment?.l1;
};

export const useToChain = () => {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  return withdrawing ? deployment?.l1 : deployment?.l2;
};

export const useHyperlaneGasQuote = () => {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const token = useConfigState.useToken();
  const to = useToChain();

  const destinationHyperlaneDomain = hyperlaneDomains[to?.id ?? 0];

  return useContractRead({
    abi: InterchainGasPaymasterAbi,
    functionName: "quoteGasPayment",
    args: [destinationHyperlaneDomain ?? 0, CCTP_MINT_GAS_COST],
    enabled: deployment!! && !!token && isCctpBridgeOperation(token),
    address: hyperlaneAddresses[destinationHyperlaneDomain ?? 0]?.igp ?? "0x",
  });
};
