import { FetchFeeDataResult } from "@wagmi/core";
import { Address } from "viem";

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
  l1FeeData?: FetchFeeDataResult;
  l2FeeData?: FetchFeeDataResult;
  hyperlaneGasQuote?: bigint | undefined;
};

export type DepositTxResolver = (
  args: DepositArgs
) => TransactionArgs | undefined;
