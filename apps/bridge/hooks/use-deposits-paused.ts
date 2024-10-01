import { isAddressEqual } from "viem";
import { useReadContract } from "wagmi";

import { wstETHBridgeAbi } from "@/abis/wstETHBridge";
import { useConfigState } from "@/state/config";
import { isOptimismToken } from "@/utils/guards";
import { isOptimism } from "@/utils/is-mainnet";

import { useDeployment } from "./use-deployment";

export const useDepositsPaused = () => {
  const deployment = useDeployment();
  const token = useConfigState.useToken();

  const l1Token = token?.[deployment?.l1.id ?? 0];

  const isDepositsEnabled = useReadContract({
    abi: wstETHBridgeAbi,
    functionName: "isDepositsEnabled",
    address:
      !!l1Token &&
      !!deployment &&
      isOptimism(deployment) &&
      isOptimismToken(l1Token)
        ? l1Token.standardBridgeAddresses[deployment.l2.id]
        : "0x",
    query: {
      enabled:
        !!deployment &&
        isOptimism(deployment) &&
        !!l1Token &&
        isAddressEqual(
          l1Token.address,
          "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"
        ),
    },
    chainId: deployment?.l1.id,
  });

  return typeof isDepositsEnabled.data === "undefined"
    ? false
    : !isDepositsEnabled.data;
};
