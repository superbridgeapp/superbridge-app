import { Address } from "viem";

import { isArbitrum, isOptimism } from "@/utils/is-mainnet";
import { useConfigState } from "@/state/config";
import { isArbitrumToken } from "@/utils/guards";

import { useFromChain, useToChain } from "./use-chain";
import { useDeployment } from "./use-deployment";

export function useApprovalAddressGasToken(): Address | undefined {
  const from = useFromChain();
  const to = useToChain();
  const deployment = useDeployment();
  const stateToken = useConfigState.useToken();

  const token = stateToken?.[from?.id ?? 0];

  if (!deployment) return;

  if (isArbitrum(deployment)) {
    if (token && isArbitrumToken(token)) {
      return token.arbitrumBridgeInfo?.[to?.id ?? 0];
    }
    return deployment.contractAddresses.inbox as Address;
  }

  if (isOptimism(deployment)) {
    return deployment.contractAddresses.optimismPortal as Address;
  }
}
