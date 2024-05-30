import { useReadContracts } from "wagmi";

import { useConfigState } from "@/state/config";
import { isOptimismToken } from "@/utils/guards";
import { isEth } from "@/utils/is-eth";
import { l2TokenIsLegacy } from "@/utils/l2-token-is-legacy";

import { useDeployment } from "./use-deployment";

const L2StandardERC20 = [
  {
    inputs: [],
    name: "l1Token",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "l2Bridge",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const useL2TokenIsLegacy = () => {
  const stateToken = useConfigState.useToken();

  const deployment = useDeployment();

  const token = stateToken?.[deployment?.l2.id ?? 0];
  const reads = useReadContracts({
    contracts: [
      {
        abi: L2StandardERC20,
        address: token?.address,
        chainId: token?.chainId,
        functionName: "l2Bridge",
      },
      {
        abi: L2StandardERC20,
        address: token?.address,
        chainId: token?.chainId,
        functionName: "l1Token",
      },
    ],
    allowFailure: true,
    query: {
      enabled: !!token && isOptimismToken(token) && !isEth(token),
    },
  });

  if (token && !isOptimismToken(token)) {
    return false;
  }

  if (isEth(token)) {
    return false;
  }

  if (reads.data && token && deployment?.l1.id) {
    const [l2Bridge, l1Token] = reads.data;
    return l2TokenIsLegacy({
      l2Bridge: l2Bridge.status === "success",
      l1Token: l1Token.status === "success",

      isDefaultBridge:
        token.standardBridgeAddresses[deployment.l1.id] ===
        deployment.contractAddresses.l2.L2StandardBridge,
    });
  }

  return undefined;
};
