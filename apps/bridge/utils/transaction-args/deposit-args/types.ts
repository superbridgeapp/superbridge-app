import { Address } from "viem";
import { UseEstimateFeesPerGasReturnType } from "wagmi";

import { CctpDomainDto, DeploymentDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

import { TransactionArgs } from "../withdraw-args/types";

export type DepositArgs = {
  deployment: DeploymentDto;
  stateToken: MultiChainToken;
  proxyBridge?: Address;
  cctp?: { from: CctpDomainDto | undefined; to: CctpDomainDto | undefined };
  recipient: Address;
  weiAmount: bigint;
  l1FeeData?: UseEstimateFeesPerGasReturnType["data"];
  l2FeeData?: UseEstimateFeesPerGasReturnType["data"];
  hyperlaneGasQuote?: bigint | undefined;
};

export type DepositTxResolver = (
  args: DepositArgs
) => TransactionArgs | undefined;
