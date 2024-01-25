import { FetchFeeDataResult } from "@wagmi/core";
import { Address } from "viem";

import { CctpDomainDto, DeploymentDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

export type TransactionArgs = {
  approvalAddress: Address | undefined;
  tx: {
    to: Address;
    value: bigint;
    data: Address;
    chainId: number;
    gas?: bigint;
  };
};

export type WithdrawArgs = {
  deployment: DeploymentDto;
  stateToken: MultiChainToken;
  proxyBridge?: Address | undefined;
  cctp?: { from: CctpDomainDto | undefined; to: CctpDomainDto | undefined };
  l2TokenIsLegacy?: boolean;
  recipient: Address;
  weiAmount: bigint;
  options: { forceViaL1: boolean; easyMode: boolean };
  l1FeeData?: FetchFeeDataResult;
  l2FeeData?: FetchFeeDataResult;
  hyperlaneGasQuote?: bigint | undefined;
};

export type WithdrawTxResolver = (
  args: WithdrawArgs
) => TransactionArgs | undefined;
