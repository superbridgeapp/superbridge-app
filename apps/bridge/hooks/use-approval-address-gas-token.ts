import { Address } from "viem";

import { useConfigState } from "@/state/config";
import { isArbitrumToken } from "@/utils/guards";
import { isEth } from "@/utils/is-eth";
import { isArbitrum, isOptimism } from "@/utils/is-mainnet";

import { useFromChain, useToChain } from "./use-chain";
import { useDeployment } from "./use-deployment";

export function useApprovalAddressGasToken(): Address | undefined {
  const from = useFromChain();
  const to = useToChain();
  const deployment = useDeployment();
  const stateToken = useConfigState.useToken();

  const fromToken = stateToken?.[from?.id ?? 0];
  const toToken = stateToken?.[to?.id ?? 0];

  if (!deployment) return;

  if (isArbitrum(deployment)) {
    if (fromToken && toToken && isArbitrumToken(fromToken) && !isEth(toToken)) {
      return fromToken.arbitrumBridgeInfo?.[to?.id ?? 0];
    }
    return deployment.contractAddresses.inbox as Address;
  }

  if (isOptimism(deployment)) {
    return deployment.contractAddresses.optimismPortal as Address;
  }
}
