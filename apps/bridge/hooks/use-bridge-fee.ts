import { useReadContract } from "wagmi";

import { configurations } from "@/config/contract-addresses";
import { useConfigState } from "@/state/config";

import { L1BridgeAbi } from "../abis/L1Bridge";
import { useDeployment } from "./use-deployment";

export const useBridgeFee = () => {
  const deployment = useDeployment();
  const token = useConfigState.useToken();
  const withdrawing = useConfigState.useWithdrawing();

  let address = withdrawing
    ? configurations[deployment?.name ?? ""]?.contracts.l2Bridge
    : configurations[deployment?.name ?? ""]?.contracts.l1Bridge;
  if (token?.[1]?.name === "Wrapped liquid staked Ether 2.0") {
    address = undefined;
  }

  const bridgeFee = useReadContract({
    abi: L1BridgeAbi,
    functionName: "FEE",
    address,
    chainId: withdrawing ? deployment?.l2.id : deployment?.l1.id,
  });

  return bridgeFee;
};
