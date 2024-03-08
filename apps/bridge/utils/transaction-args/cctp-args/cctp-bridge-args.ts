import { Address, encodeFunctionData } from "viem";

import { TokenMessengerAbi } from "@/abis/cctp/TokenMessenger";
import { CctpDomainDto, DeploymentDto } from "@/codegen/model";
import { Token } from "@/types/token";
import { isOptimism } from "@/utils/is-mainnet";

import { forceTransaction } from "../withdraw-args/force";
import { TransactionArgs } from "../withdraw-args/types";
import { CctpBridgeTxResolver, addressToBytes32 } from "./common";

const impl = (
  deployment: DeploymentDto,
  fromConfig: CctpDomainDto,
  toConfig: CctpDomainDto,
  fromToken: Token,
  toToken: Token,
  recipient: Address,
  weiAmount: bigint
): TransactionArgs | undefined => {
  return {
    approvalAddress: fromConfig.contractAddresses.tokenMessenger as Address,
    tx: {
      to: fromConfig.contractAddresses.tokenMessenger as Address,
      data: encodeFunctionData({
        abi: TokenMessengerAbi,
        functionName: "depositForBurn",
        args: [
          weiAmount,
          toConfig.domain,
          addressToBytes32(recipient),
          fromToken.address,
        ],
      }),
      value: BigInt("0"),
      chainId: fromConfig.chainId,
    },
  };
};

export const cctpBridgeArgs: CctpBridgeTxResolver = (
  {
    deployment,
    stateToken,
    cctp,
    recipient,
    weiAmount,
    options: { forceViaL1 },
  },
  withdrawing
) => {
  const fromToken = withdrawing
    ? stateToken[deployment.l2.id]
    : stateToken[deployment.l1.id];
  const toToken = withdrawing
    ? stateToken[deployment.l1.id]
    : stateToken[deployment.l2.id];

  if (!fromToken || !toToken || !cctp?.from || !cctp.to) {
    return;
  }

  const result = impl(
    deployment,
    cctp.from,
    cctp.to,
    fromToken,
    toToken,
    recipient,
    weiAmount
  );
  if (!result) {
    return;
  }

  if (withdrawing && forceViaL1 && isOptimism(deployment)) {
    return forceTransaction(deployment, result);
  }

  return result;
};
