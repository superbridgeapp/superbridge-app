import { Address, encodeFunctionData } from "viem";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { OptimismDeploymentDto } from "@/utils/is-mainnet";

import { TransactionArgs } from "./types";

export function forceTransaction(
  deployment: OptimismDeploymentDto,
  result: TransactionArgs
) {
  return {
    approvalAddress: result.approvalAddress,
    tx: {
      to: deployment.contractAddresses.optimismPortal as Address,
      data: encodeFunctionData({
        abi: OptimismPortalAbi,
        functionName: "depositTransaction",
        args: [
          result.tx.to,
          result.tx.value,
          BigInt(200_000),
          false,
          result.tx.data,
        ],
      }),
      chainId: deployment.l1.id,
      value: BigInt(0),
      gas: BigInt("300000"),
    },
  };
}
