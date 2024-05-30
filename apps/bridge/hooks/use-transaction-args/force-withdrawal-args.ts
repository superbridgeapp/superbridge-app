import { Address, encodeFunctionData } from "viem";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { isOptimism } from "@/utils/is-mainnet";
import { DeploymentDto } from "@/codegen/model";

import { TransactionArgs } from "./types";

export const forceWithdrawalArgs = (
  args: TransactionArgs | undefined,
  deployment: DeploymentDto | null
) => {
  if (!args || !deployment || !isOptimism(deployment)) {
    return;
  }

  return {
    approvalAddress: args.approvalAddress,
    tx: {
      to: deployment.contractAddresses.optimismPortal as Address,
      data: encodeFunctionData({
        abi: OptimismPortalAbi,
        functionName: "depositTransaction",
        args: [args.tx.to, args.tx.value, BigInt(200_000), false, args.tx.data],
      }),
      chainId: deployment.l1.id,
      value: BigInt(0),
      gas: BigInt("300000"),
    },
  };
};
